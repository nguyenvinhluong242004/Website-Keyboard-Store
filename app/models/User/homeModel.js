const pool = require('../../config/database');
const path = require('path');
const fs = require('fs');

const getProducts = async (visibleCount) => {
    const client = await pool.connect();
    try {
        // Lấy tổng số sản phẩm
        const totalResult = await client.query(`SELECT COUNT(*) FROM public.product`);
        // Lấy dữ liệu sản phẩm
        const dataResult = await client.query(`
            SELECT p.*, c.categoryname
            FROM public.product p
            JOIN public.category c ON p.categoryid = c.categoryid
            ORDER BY RANDOM()
            LIMIT $1
        `, [visibleCount]);

        // Thêm ảnh đầu tiên vào từng sản phẩm
        const productsWithImages = await Promise.all(dataResult.rows.map(async (product) => {
            const folderPath = path.join(__dirname, '../../../public', product.imagepath);
            try {
                const files = fs.readdirSync(folderPath);
                const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
                product.firstImage = imageFiles.length > 0 ? `${product.imagepath}/${imageFiles[0]}` : '/path/to/default-image.jpg';
            } catch (err) {
                console.error(`Không thể đọc thư mục ảnh: ${folderPath}`, err);
                product.firstImage = '/path/to/default-image.jpg'; // Ảnh mặc định nếu xảy ra lỗi
            }
            return product;
        }));

        return {
            totalProducts: parseInt(totalResult.rows[0].count, 10),
            data: productsWithImages,
        };
    } catch (error) {
        console.error('Lỗi truy vấn sản phẩm:', error);
        throw error; // Ném lỗi để controller xử lý
    } finally {
        client.release();
    }
};

const getKeycap = async (maxCount) => {
    const client = await pool.connect();
    try {
        const dataResult = await client.query(`
            SELECT p.*, c.categoryname
            FROM public.product p
            JOIN public.category c ON p.categoryid = c.categoryid
            WHERE p.categoryid = 1
            LIMIT $1
        `, [maxCount]);

        return dataResult.rows; // Trả về danh sách sản phẩm
    } catch (error) {
        console.error('Lỗi truy vấn Keycap:', error);
        throw error; // Ném lỗi để controller xử lý
    } finally {
        client.release();
    }
};

const getKit = async (maxCount) => {
    const client = await pool.connect();
    try {
        const dataResult = await client.query(`
            SELECT p.*, c.categoryname
            FROM public.product p
            JOIN public.category c ON p.categoryid = c.categoryid
            WHERE p.categoryid = 2
            LIMIT $1
        `, [maxCount]);

        return dataResult.rows; // Trả về danh sách sản phẩm
    } catch (error) {
        console.error('Lỗi truy vấn Keycap:', error);
        throw error; // Ném lỗi để controller xử lý
    } finally {
        client.release();
    }
};

const getAccessories = async (maxCount) => {
    const client = await pool.connect();
    try {
        const dataResult = await client.query(`
            SELECT p.*, c.categoryname
            FROM public.product p
            JOIN public.category c ON p.categoryid = c.categoryid
            WHERE p.categoryid = 3
            LIMIT $1
        `, [maxCount]);

        return dataResult.rows; // Trả về danh sách sản phẩm
    } catch (error) {
        console.error('Lỗi truy vấn Keycap:', error);
        throw error; // Ném lỗi để controller xử lý
    } finally {
        client.release();
    }
};

const getSwitch = async (maxCount) => {
    const client = await pool.connect();
    try {
        const dataResult = await client.query(`
            SELECT p.*, c.categoryname
            FROM public.product p
            JOIN public.category c ON p.categoryid = c.categoryid
            WHERE p.categoryid = 4
            LIMIT $1
        `, [maxCount]);

        return dataResult.rows; // Trả về danh sách sản phẩm
    } catch (error) {
        console.error('Lỗi truy vấn Keycap:', error);
        throw error; // Ném lỗi để controller xử lý
    } finally {
        client.release();
    }
};

const getPosters = async () => {
    const client = await pool.connect();
    try {
        // Lấy tổng số poster (có thể bỏ qua nếu không cần)
        const totalResult = await client.query(`SELECT COUNT(*) FROM public.poster`);
        
        // Sửa câu truy vấn để chỉ lấy 4 poster đầu tiên
        const dataResult = await client.query(`SELECT * FROM public.poster LIMIT 4`);

        return {
            totalPosters: parseInt(totalResult.rows[0].count, 10),
            data: dataResult.rows,
        };
    } catch (error) {
        console.error('Lỗi truy vấn poster:', error);
        throw error; // Ném lỗi để controller xử lý
    } finally {
        client.release();
    }
};


module.exports = {
    getProducts,
    getKeycap,
    getKit,
    getAccessories,
    getSwitch,
    getPosters,
};
