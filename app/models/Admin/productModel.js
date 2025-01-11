const pool = require('../../config/database');
const fs = require('fs');
const path = require('path');

const getAllProducts = async () => {
    
    try {
        const totalResult = await pool.query(`SELECT COUNT(*) FROM public.product`);
        const dataResult = await pool.query(`
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
    } 
};

const getBrands = async () => {
    
    try {
        const result = await pool.query(`
            SELECT * 
            FROM public.brand
        `);
        return result.rows;
    } catch (error) {
        console.error('Lỗi truy vấn thương hiệu:', error);
        throw error;
    } 
};

const getCategories = async () => {
    
    try {
        const result = await pool.query(`
            SELECT * 
            FROM public.category
        `);
        return result.rows;
    } catch (error) {
        console.error('Lỗi truy vấn danh mục:', error);
        throw error;
    } 
};

const getFilteredProducts = async ({ search, availability, category, brand, price, sortBy, limit, offset }) => {
    
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
            AND p.type = 1
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
            let priceValue;
            if (price.startsWith('under-')) {
                // Lọc giá nhỏ hơn một giá trị
                priceValue = parseInt(price.split('-')[1], 10);
                console.log("price", priceValue);
                if (!isNaN(priceValue)) {
                    query += ` AND p.currentprice < $${queryParams.length + 1}`;
                }
            } else if (price.startsWith('over-')) {
                // Lọc giá lớn hơn một giá trị
                priceValue = parseInt(price.split('-')[1], 10);
                if (!isNaN(priceValue)) {
                    query += ` AND p.currentprice > $${queryParams.length + 1}`;
                    queryParams.push(priceValue);
                }
            } else if (price.includes('-')) {
                // Lọc giá trong khoảng
                const priceRange = price.split('-').map(value => parseInt(value, 10));
                if (!isNaN(priceRange[0]) && !isNaN(priceRange[1])) {
                    query += ` AND p.currentprice BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
                    queryParams.push(priceRange[0]);
                    queryParams.push(priceRange[1]);
                }
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
            query += ` ORDER BY p.currentprice ASC`;
        } else if (sortBy === 'price-high-low') {
            query += ` ORDER BY p.currentprice DESC`;
        } else {
            query += ` ORDER BY p.productname ASC`;
        }

        // Phân trang
        query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        const result = await pool.query(query, queryParams);

        // Truy vấn để tính tổng số sản phẩm với các bộ lọc
        let countQuery = `
            SELECT COUNT(*) 
            FROM public.product p
            LEFT JOIN public.category c ON p.categoryid = c.categoryid
            LEFT JOIN public.brand b ON p.brandid = b.brandid
            WHERE 1=1
            AND p.type = 1
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
            let priceValue;
            if (price.startsWith('under-')) {
                // Lọc giá nhỏ hơn một giá trị
                const maxPrice = price.slice(6); // Lấy giá trị sau 'under-'
                priceValue = parseInt(maxPrice, 10);
                console.log(priceValue)
                if (!isNaN(priceValue)) {
                    countQuery += ` AND p.currentprice BETWEEN 0 AND $${countQueryParams.length + 1}`;
                    countQueryParams.push(priceValue);
                }
            } else if (price.startsWith('over-')) {
                // Lọc giá lớn hơn một giá trị
                const minPrice = price.slice(5); // Lấy giá trị sau 'over-'
                priceValue = parseInt(minPrice, 10);
                if (!isNaN(priceValue)) {
                    countQuery += ` AND p.currentprice BETWEEN $${countQueryParams.length + 1} AND 200 `;
                    countQueryParams.push(priceValue);
                }
            } else if (price.includes('-')) {
                // Lọc giá trong khoảng
                const priceRange = price.split('-').map(value => parseInt(value, 10));
                if (priceRange.length === 2 && !isNaN(priceRange[0]) && !isNaN(priceRange[1])) {
                    countQuery += ` AND p.currentprice BETWEEN $${countQueryParams.length + 1} AND $${countQueryParams.length + 2}`;
                    countQueryParams.push(priceRange[0]);
                    countQueryParams.push(priceRange[1]);
                }
            }
        }
        if (availability) {
            if (availability === 'in-stock') {
                countQuery += ` AND p.quantity > 0`; // Sản phẩm còn hàng
            } else if (availability === 'out-of-stock') {
                countQuery += ` AND p.quantity <= 0`; // Sản phẩm hết hàng
            }
        }

        const totalProductsResult = await pool.query(countQuery, countQueryParams);
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
    } 
};

// Hàm thêm sản phẩm vào database
const addProduct = async ({ name, listedPrice, adjustedPrice, type, quantity, brand, specification, description}) => {
    
    try {
        // Random estimatearrive từ 1 đến 7
        const estimatearrive = Math.floor(Math.random() * 7) + 1;

        // Tra cứu categoryid từ bảng category
        const categoryQuery = `
            SELECT categoryid 
            FROM public.category 
            WHERE categoryname = $1
        `;
        const categoryResult = await pool.query(categoryQuery, [type]);
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
        const brandResult = await pool.query(brandQuery, [brand]);
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
        const result = await pool.query(insertProductQuery, productParams);
        const productId = result.rows[0].productid;

        // Ghi đường dẫn imagepath
        const imagePath = `/image/${productId}`;
        const updateImagePathQuery = `
            UPDATE public.product 
            SET imagepath = $1 
            WHERE productid = $2
        `;
        await pool.query(updateImagePathQuery, [imagePath, productId]);

        return { productId };
    } catch (error) {
        console.error('Error adding product:', error);
        throw new Error('Failed to add product');
    } 
};

// Hàm kiểm tra xem sản phẩm đã tồn tại chưa
const isProductExist = async (name) => {
    
    try {
        const query = `
            SELECT COUNT(*) AS count 
            FROM public.product 
            WHERE productname = $1
        `;
        const result = await pool.query(query, [name]);
        return parseInt(result.rows[0].count, 10) > 0;
    } catch (error) {
        console.error('Error checking product existence:', error);
        throw new Error('Failed to check product existence');
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

const deleteOne = async (productId) => {
    // Kiểm tra đầu vào
    if (!productId || isNaN(productId)) {
        throw new Error('Invalid productId');
    }

    
    try {
        const query = `
            UPDATE public.product 
            SET type = NULL 
            WHERE productid = $1
        `;
        const result = await pool.query(query, [productId]);

        // Trả về kết quả
        return result.rowCount > 0; // true nếu có dòng bị ảnh hưởng, false nếu không
    } catch (error) {
        console.error('Error setting product type to NULL:', error);
        throw new Error('Failed to delete product');
    }
};

const findByIdAndUpdate = async (productId, updatedData) => {
    // Kiểm tra đầu vào
    if (!productId || isNaN(productId)) {
        throw new Error('Invalid productId');
    }

    // Tạo query cập nhật các trường trong bảng product
    const { 
        productname, 
        specification, 
        oldprice, 
        currentprice, 
        estimateArrive, 
        description, 
        categoryname, 
        brandname, 
        quantity, 
        type 
    } = updatedData;

    console.log(updatedData)

    // Câu lệnh SQL để cập nhật các trường của sản phẩm
    const query = `
        UPDATE public.product
        SET 
            productname = $1,
            specification = $2,
            oldprice = $3,
            currentprice = $4,
            estimatearrive = $5,
            description = $6,
            categoryid = $7,
            brandid = $8,
            quantity = $9,
            type = $10
        WHERE productid = $11
        RETURNING *;  -- Trả về sản phẩm đã được cập nhật
    `;

    const values = [
        productname, 
        specification, 
        oldprice, 
        currentprice, 
        estimateArrive, 
        description, 
        categoryname, 
        brandname, 
        quantity, 
        type, 
        productId
    ];

    try {
        // Thực hiện câu lệnh SQL
        const result = await pool.query(query, values);

        // Nếu có sản phẩm được cập nhật, trả về thông tin sản phẩm đã cập nhật
        if (result.rowCount > 0) {
            return result.rows[0];  // Trả về thông tin của sản phẩm sau khi cập nhật
        } else {
            return null;  // Nếu không có sản phẩm nào được cập nhật
        }
    } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Failed to update product');
    } 
};

module.exports = {
    getAllProducts,
    getBrands,
    getCategories,
    getFilteredProducts,
    addProduct,
    isProductExist,
    saveImage,
    deleteOne,
    findByIdAndUpdate,
};