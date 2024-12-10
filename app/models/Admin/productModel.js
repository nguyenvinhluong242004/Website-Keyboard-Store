const pool = require('../../config/database');

const getAllProducts = async () => {
    const client = await pool.connect();
    try {
        const totalResult = await client.query(`SELECT COUNT(*) FROM public.product`);
        const dataResult = await client.query(`
            SELECT 
                p.*, 
                c.categoryname, 
                b.brandname,
                CASE 
                    WHEN p.quantity > 0 THEN 'In stock'
                    ELSE 'Out of stock'
                END AS status
            FROM 
                public.product p
            LEFT JOIN 
                public.category c ON p.categoryid = c.categoryid
            LEFT JOIN 
                public.brand b ON p.brandid = b.brandid
        `);

        return {
            totalProducts: parseInt(totalResult.rows[0].count, 10),
            data: dataResult.rows,
        };
    } catch (error) {
        console.error('Lỗi truy vấn tất cả sản phẩm:', error);
        throw error; // Ném lỗi để controller xử lý
    } finally {
        client.release();
    }
};

const getBrands = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * 
            FROM public.brand
        `);
        return result.rows;
    } catch (error) {
        console.error('Lỗi truy vấn thương hiệu:', error);
        throw error;
    } finally {
        client.release();
    }
};

const getCategories = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * 
            FROM public.category
        `);
        return result.rows;
    } catch (error) {
        console.error('Lỗi truy vấn danh mục:', error);
        throw error;
    } finally {
        client.release();
    }
};

const getFilteredProducts = async ({ search, availability, category, brand, price, sortBy, limit, offset }) => {
    const client = await pool.connect();
    try {
        // Truy vấn để lấy sản phẩm theo các bộ lọc
        let query = `
            SELECT 
                p.*, 
                c.categoryname, 
                b.brandname,
                CASE 
                    WHEN p.quantity > 0 THEN 'Instock'
                    ELSE 'Out of stock'
                END AS status
            FROM 
                public.product p
            LEFT JOIN 
                public.category c ON p.categoryid = c.categoryid
            LEFT JOIN 
                public.brand b ON p.brandid = b.brandid
            WHERE 1=1
        `;
        const queryParams = [];

        // Xử lý tìm kiếm theo tên sản phẩm
        if (search) {
            query += ` AND p.productname ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${search}%`);
        }

        // Xử lý lọc theo danh mục
        if (category) {
            query += ` AND c.categoryname = $${queryParams.length + 1}`;
            queryParams.push(category);
        }

        // Xử lý lọc theo thương hiệu
        if (brand) {
            query += ` AND b.brandname = $${queryParams.length + 1}`;
            queryParams.push(brand);
        }

        // Xử lý lọc theo giá
        if (price) {
            const priceRange = price.split('-');
            if (priceRange.length === 1) {
                query += ` AND p.price < $${queryParams.length + 1}`;
                queryParams.push(priceRange[0]);
            } else {
                query += ` AND p.price BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
                queryParams.push(priceRange[0]);
                queryParams.push(priceRange[1]);
            }
        }

        // Xử lý lọc theo availability (trạng thái tồn kho)
        if (availability) {
            if (availability === 'in-stock') {
                query += ` AND p.quantity > 0`; // Sản phẩm còn hàng
            } else if (availability === 'out-of-stock') {
                query += ` AND p.quantity <= 0`; // Sản phẩm hết hàng
            }
        }

        // Xử lý sắp xếp
        if (sortBy === 'price-low-high') {
            query += ` ORDER BY p.price ASC`;
        } else if (sortBy === 'price-high-low') {
            query += ` ORDER BY p.price DESC`;
        } else {
            query += ` ORDER BY p.productname ASC`;
        }

        // Phân trang
        query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        const result = await client.query(query, queryParams);

        // Truy vấn để tính tổng số sản phẩm với các bộ lọc
        let countQuery = `
            SELECT COUNT(*) 
            FROM public.product p
            LEFT JOIN public.category c ON p.categoryid = c.categoryid
            LEFT JOIN public.brand b ON p.brandid = b.brandid
            WHERE 1=1
        `;
        const countQueryParams = [];

        // Lặp lại các bộ lọc để tính tổng số sản phẩm
        if (search) {
            countQuery += ` AND p.productname ILIKE $${countQueryParams.length + 1}`;
            countQueryParams.push(`%${search}%`);
        }
        if (category) {
            countQuery += ` AND c.categoryname = $${countQueryParams.length + 1}`;
            countQueryParams.push(category);
        }
        if (brand) {
            countQuery += ` AND b.brandname = $${countQueryParams.length + 1}`;
            countQueryParams.push(brand);
        }
        if (price) {
            const priceRange = price.split('-');
            if (priceRange.length === 1) {
                countQuery += ` AND p.price < $${countQueryParams.length + 1}`;
                countQueryParams.push(priceRange[0]);
            } else {
                countQuery += ` AND p.price BETWEEN $${countQueryParams.length + 1} AND $${countQueryParams.length + 2}`;
                countQueryParams.push(priceRange[0]);
                countQueryParams.push(priceRange[1]);
            }
        }
        if (availability) {
            if (availability === 'in-stock') {
                countQuery += ` AND p.quantity > 0`; // Sản phẩm còn hàng
            } else if (availability === 'out-of-stock') {
                countQuery += ` AND p.quantity <= 0`; // Sản phẩm hết hàng
            }
        }

        const totalProductsResult = await client.query(countQuery, countQueryParams);
        const totalProducts = parseInt(totalProductsResult.rows[0].count, 10);

        return {
            totalProducts,
            data: result.rows,
        };
    } catch (error) {
        console.error('Lỗi truy vấn lọc sản phẩm:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Hàm thêm sản phẩm vào database
const addProduct = async ({ name, listedPrice, adjustedPrice, type, quantity, brand, specification, description, images }) => {
    const client = await pool.connect();
    try {
        // Random estimatearrive từ 1 đến 7
        const estimatearrive = Math.floor(Math.random() * 7) + 1;

        // Tra cứu categoryid từ bảng category
        const categoryQuery = `
            SELECT categoryid 
            FROM public.category 
            WHERE categoryname = $1
        `;
        const categoryResult = await client.query(categoryQuery, [type]);
        if (categoryResult.rows.length === 0) {
            throw new Error(`Category not found for type: ${type}`);
        }
        const categoryid = categoryResult.rows[0].categoryid;

        // Tra cứu brandid từ bảng brand
        const brandQuery = `
            SELECT brandid 
            FROM public.brand 
            WHERE brandname = $1
        `;
        const brandResult = await client.query(brandQuery, [brand]);
        if (brandResult.rows.length === 0) {
            throw new Error(`Brand not found for brand: ${brand}`);
        }
        const brandid = brandResult.rows[0].brandid;

        // Chèn thông tin sản phẩm vào bảng product
        const insertProductQuery = `
            INSERT INTO public.product (
                productname, specification, oldprice, currentprice, estimatearrive, 
                description, categoryid, brandid, quantity
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING productid
        `;
        const productParams = [
            name, specification, listedPrice, adjustedPrice, estimatearrive,
            description, categoryid, brandid, quantity
        ];
        const result = await client.query(insertProductQuery, productParams);
        const productId = result.rows[0].productid;

        // Ghi đường dẫn imagepath
        const imagePath = `/image/${productId}`;
        const updateImagePathQuery = `
            UPDATE public.product 
            SET imagepath = $1 
            WHERE productid = $2
        `;
        await client.query(updateImagePathQuery, [imagePath, productId]);

        // Chèn ảnh vào bảng product_images (nếu có)
        if (images && images.length > 0) {
            const insertImagesQuery = `
                INSERT INTO public.product_images (productid, imageurl)
                VALUES ($1, unnest($2::text[]))
            `;
            await client.query(insertImagesQuery, [productId, images]);
        }

        return { productId };
    } catch (error) {
        console.error('Error adding product:', error);
        throw new Error('Failed to add product');
    } finally {
        client.release();
    }
};

// Hàm kiểm tra xem sản phẩm đã tồn tại chưa
const isProductExist = async (name) => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT COUNT(*) AS count 
            FROM public.product 
            WHERE productname = $1
        `;
        const result = await client.query(query, [name]);
        return parseInt(result.rows[0].count, 10) > 0;
    } catch (error) {
        console.error('Error checking product existence:', error);
        throw new Error('Failed to check product existence');
    } finally {
        client.release();
    }
};

module.exports = {
    getAllProducts,
    getBrands,
    getCategories,
    getFilteredProducts,
    addProduct,
    isProductExist,
};