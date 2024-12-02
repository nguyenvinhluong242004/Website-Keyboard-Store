const pool = require('../../config/database');

const getGroupByProduct = async (req, res) => {
    const visibleCount = req.query.visibleCount || 1;

    const client = await pool.connect();
    try {
        // Query to get data from database
        const result = await client.query(`
            SELECT p.* 
            FROM public.groupbyproduct g
            JOIN public.product p ON g.productid = p.productid
            WHERE g.groupbyid = 1
            LIMIT $1
        `, [visibleCount]);
        return {
            dataGroupByProduct: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn!', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy dữ liệu.' });
    } finally {
        client.release();
    }
};

module.exports = {
    getGroupByProduct,
};