const pool = require('../../config/database');
const fs = require('fs');
const path = require('path');

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

        // Thêm trường firstImage vào từng sản phẩm
        const products = dataResult.rows.map(product => {
            const productDir = path.join(__dirname, '../../../public', product.imagepath || '');
            
            let firstImage = null;
            try {
                if (fs.existsSync(productDir)) {
                    const files = fs.readdirSync(productDir); // Lấy danh sách file trong thư mục
                    if (files.length > 0) {
                        firstImage = `${product.imagepath}/${files[0]}`; // Đường dẫn ảnh đầu tiên
                    }
                }
            } catch (err) {
                console.error(`Lỗi khi đọc thư mục của sản phẩm ${product.productid}:`, err);
            }

            return {
                ...product,
                firstImage: firstImage || null, // Gán đường dẫn hoặc null nếu không có ảnh
            };
        });

        return {
            totalProducts: parseInt(totalResult.rows[0].count, 10),
            data: products,
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

        // return {
        //     totalProducts,
        //     data: result.rows,
        // };

        const products = result.rows.map(product => {
            const productDir = path.join(__dirname, '../../../public', product.imagepath || '');
            
            let firstImage = null;
            try {
                if (fs.existsSync(productDir)) {
                    const files = fs.readdirSync(productDir); // Lấy danh sách file trong thư mục
                    if (files.length > 0) {
                        firstImage = `${product.imagepath}/${files[0]}`; // Đường dẫn ảnh đầu tiên
                    }
                }
            } catch (err) {
                console.error(`Lỗi khi đọc thư mục của sản phẩm ${product.productid}:`, err);
            }

            return {
                ...product,
                firstImage: firstImage || null, // Gán đường dẫn hoặc null nếu không có ảnh
            };
        });

        console.log(products)

        return {
            totalProducts,
            data: products,
        };
    } catch (error) {
        console.error('Lỗi truy vấn lọc sản phẩm:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Hàm thêm sản phẩm vào database
const addProduct = async ({ name, listedPrice, adjustedPrice, type, quantity, brand, specification, description}) => {
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

        const productType = 1;

        // Chèn thông tin sản phẩm vào bảng product
        const insertProductQuery = `
            INSERT INTO public.product (
                productname, specification, oldprice, currentprice, estimatearrive, 
                description, categoryid, brandid, quantity, type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING productid
        `;
        const productParams = [
            name, specification, listedPrice, adjustedPrice, estimatearrive,
            description, categoryid, brandid, quantity, productType
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

const saveImage = (productId, image) => {
    return new Promise((resolve, reject) => {
        try {
            if (!image || !productId) {
                return reject({ message: 'Thiếu thông tin cần thiết hoặc file ảnh!' });
            }

            // Tạo thư mục cho sản phẩm nếu chưa tồn tại
            const dir = path.join(__dirname, '../../../public/image', productId);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`Tạo thư mục: ${dir}`);
            }

            // Chuyển đổi base64 thành buffer và lưu thành file
            const base64Data = image.split(',')[1]; // Tách phần base64 ra
            const buffer = Buffer.from(base64Data, 'base64'); // Chuyển đổi base64 thành buffer

            // Tạo tên file duy nhất
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`; // Bạn có thể thay đổi phần mở rộng tùy ý
            const filePath = path.join(dir, fileName); // Đường dẫn để lưu file

            // Lưu file vào thư mục
            fs.writeFileSync(filePath, buffer); // Lưu file

            resolve(filePath); // Trả về đường dẫn của ảnh đã lưu
        } catch (error) {
            reject({ message: 'Có lỗi xảy ra khi lưu ảnh!', error });
        }
    });
};

module.exports = {
    getAllProducts,
    getBrands,
    getCategories,
    getFilteredProducts,
    addProduct,
    isProductExist,
    saveImage,
};