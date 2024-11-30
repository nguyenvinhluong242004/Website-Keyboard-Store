const pool = require('../../config/database');

const getGroupByProduct = async (req, res) => {
    const visibleCount = req.query.visibleCount || 12;

    const client = await pool.connect();
    try {
        //Query to get the sum of products 'Kit Phim' in the database
        const resultSum = await client.query(`
            SELECT COUNT(*)
            FROM public.groupbyproduct g
            JOIN public.product p ON g.productid = p.productid
            WHERE g.enddate >= CURRENT_DATE
            `)
        
        // Query to get data from database
        const result = await client.query(`
            SELECT p.* 
            FROM public.groupbyproduct g
            JOIN public.product p ON g.productid = p.productid
            WHERE g.enddate >= CURRENT_DATE
            LIMIT $1
        `, [visibleCount]);
        return {
            totalProducts: resultSum.rows[0].count,
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