const pool = require('../../config/database');

const getSwitch = async (req, res) => {
    const visibleCount = req.query.visibleCount || 12;

    const client = await pool.connect();
    try {
        //Query to get the sum of products 'Switch' in the database
        const resultSum = await client.query(`
            SELECT COUNT(*) FROM public.product p
            JOIN public.Category c ON p.categoryid = c.categoryid
            WHERE c.categoryname = 'Switchs' AND p.type IS NOT NULL
            `)
        
        // Query to get data from database
        const result = await client.query(`
            SELECT p.* FROM public.product p
            JOIN public.Category c ON p.categoryid = c.categoryid
            WHERE c.categoryname = 'Switchs' AND p.type IS NOT NULL
            LIMIT $1
        `, [visibleCount]);
        return {
            totalProducts: resultSum.rows[0].count,
            dataSwitch: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn!', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy dữ liệu.' });
    } finally {
        client.release();
    }
};

module.exports = {
    getSwitch,
};