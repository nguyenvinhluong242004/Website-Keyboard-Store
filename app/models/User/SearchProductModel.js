const pool = require('../../config/database');

const searchProduct = async (search, visibleCount) => {
    
    try {
        // Query to get the sum of products in the database
        const resultSum = await pool.query(`
            SELECT COUNT(*)
            FROM public.product
            WHERE productname ILIKE $1
            `, [`%${search}%`])

        // Query to get data from database
        const result = await pool.query(`
            SELECT *
            FROM public.product
            JOIN public.category ON product.categoryid = category.categoryid
            WHERE productname ILIKE $1
            LIMIT $2
        `, [`%${search}%`, visibleCount]);
        return {
            totalProducts: resultSum.rows[0].count,
            dataSearchProduct: result.rows
        };
    } catch (error) {
        console.error('Lỗi truy vấn!', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy dữ liệu.' });
    }
};

const checkGroupByProduct = async (productid) => {

    try {
        const result = await pool.query(`
            SELECT *
            FROM public.product
            WHERE productid = $1 And type = 2
        `, [productid]);
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error querying!', error);
        res.status(500).json({ error: 'Error fetching data.' });
    }
};

module.exports = {
    searchProduct,
    checkGroupByProduct
};