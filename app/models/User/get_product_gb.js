const pool = require('../../config/database');

const getGroupByProduct = async (id, visibleCount = 1) => {

    try {
        // Query to get data from database
        const result = await pool.query(`
            SELECT * 
            FROM public.product p 
            JOIN public.groupbyproduct g ON g.productid = p.productid
            WHERE p.productid = $1
            LIMIT $2
        `, [id, visibleCount]);

        return {
            dataGroupByProduct: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn!', error);
        throw new Error('Có lỗi xảy ra khi lấy dữ liệu.');
    }
};

module.exports = {
    getGroupByProduct,
};
