const pool = require('../../config/database');

const getGroupByProduct = async (req, res) => {
    const visibleCount = req.query.visibleCount || 12;

    try {
        //Query to get the sum of products 'Kit Phim' in the database
        const resultSum = await pool.query(`
            SELECT COUNT(*)
            FROM public.groupbyproduct g
            JOIN public.product p ON g.productid = p.productid
            WHERE g.enddate >= CURRENT_DATE AND p.type IS NOT NULL
            `)
        
        // Query to get data from database
        const result = await pool.query(`
            SELECT * 
            FROM public.groupbyproduct g
            JOIN public.product p ON g.productid = p.productid
            JOIN public.category c ON p.categoryid = c.categoryid
            WHERE g.enddate >= CURRENT_DATE AND p.type IS NOT NULL
            LIMIT $1
        `, [visibleCount]);
        return {
            totalProducts: resultSum.rows[0].count,
            dataGroupByProduct: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn!', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy dữ liệu.' });
    }
};

module.exports = {
    getGroupByProduct,
};