const pool = require('../../config/database');

const getProduct = async (id, visibleCount = 1) => {
    if (!id || isNaN(id) || id <= 0) {
        throw new Error('ID sản phẩm không hợp lệ.');
    }

    if (!Number.isInteger(visibleCount) || visibleCount <= 0) {
        throw new Error('Số lượng hiển thị không hợp lệ.');
    }

    try {
        // Query để lấy dữ liệu từ cơ sở dữ liệu
        const result = await pool.query(`
            SELECT * 
            FROM public.product p
            WHERE p.productid = $1
            LIMIT $2
        `, [id, visibleCount]);  // Sử dụng id và visibleCount trong truy vấn

        if (result.rows.length === 0) {
            throw new Error('Không tìm thấy sản phẩm.');
        }

        return {
            dataProduct: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn:', error.message);
        console.error('Chi tiết lỗi:', error.stack);
        throw new Error('Có lỗi xảy ra khi lấy dữ liệu.');
    } 
};
const getSameProduct = async (categoryId,quantity) => {
    if (!categoryId || isNaN(categoryId) || categoryId <= 0) {
        throw new Error('ID sản phẩm không hợp lệ.');
    }

    try {
        // Query để lấy dữ liệu từ cơ sở dữ liệu
        const result = await pool.query(`
            SELECT * 
            FROM public.product p
            WHERE p.categoryid = $1 and p.type = 1
            ORDER BY RANDOM()
            LIMIT $2
        `, [categoryId,quantity]); 

        if (result.rows.length === 0) {
            throw new Error('Không tìm thấy sản phẩm.');
        }

        return {
            listProducts: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn:', error.message);
        console.error('Chi tiết lỗi:', error.stack);
        throw new Error('Có lỗi xảy ra khi lấy dữ liệu.');
    } 
};
const getSameProductGB = async (categoryId,quantity) => {
    if (!categoryId || isNaN(categoryId) || categoryId <= 0) {
        throw new Error('ID sản phẩm không hợp lệ.');
    }

    try {
        // Query để lấy dữ liệu từ cơ sở dữ liệu
        const result = await pool.query(`
            SELECT * 
            FROM public.product p
            WHERE p.categoryid = $1 and p.type = 2
            ORDER BY RANDOM()
            LIMIT $2
        `, [categoryId,quantity]); 

        if (result.rows.length === 0) {
            throw new Error('Không tìm thấy sản phẩm.');
        }

        return {
            listProducts: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn:', error.message);
        console.error('Chi tiết lỗi:', error.stack);
        throw new Error('Có lỗi xảy ra khi lấy dữ liệu.');
    } 
};


module.exports = {
    getProduct,
    getSameProduct,
    getSameProductGB,
};
