const pool = require('../../config/database');

const getProduct = async (req, res) => {
    const visibleCount = req.query.visibleCount || 1;

    const client = await pool.connect();
    try {
        // Query to get data from database
        const result = await client.query(`
            SELECT * 
            FROM public.product p
            WHERE p.productid = 2
            LIMIT $1
        `, [visibleCount]);
        return {
            dataProduct: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn!', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy dữ liệu.' });
    } finally {
        client.release();
    }
};

module.exports = {
    getProduct,
};