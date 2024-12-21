const pool = require('../../config/database');

const getGroupByProduct = async (id, visibleCount = 1) => {
    const client = await pool.connect();
    try {
        // Query to get data from database
        const result = await client.query(`
            SELECT * 
            FROM public.groupbyproduct g
            JOIN public.product p ON g.productid = p.productid
            WHERE g.groupbyid = $1
            LIMIT $2
        `, [id, visibleCount]);

        return {
            dataGroupByProduct: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn!', error);
        throw new Error('Có lỗi xảy ra khi lấy dữ liệu.');
    } finally {
        client.release();
    }
};

module.exports = {
    getGroupByProduct,
};
