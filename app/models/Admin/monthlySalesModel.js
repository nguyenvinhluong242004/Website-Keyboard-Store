const pool = require('../../config/database');

const getTotalUsers = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT COUNT(*) FROM public.Users
        `);
        console.log(result.rows[0].count);
        return {
            totalUsers: result.rows[0].count
        };
    } catch (error) {
        console.error('Error querying!', error);
        res.status(500).json({ error: 'Error fetching data.' });
    } finally {
        client.release();
    }
};

const getTotalRevenue = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT SUM(TotalAmount) FROM public.Orders WHERE OrderStatus != 'Refuse'
        `);
        return {
            totalRevenue :result.rows[0].sum
        };
    } catch (error) {
        console.error('Error querying!', error);
        res.status(500).json({ error: 'Error fetching data.' });
    } finally {
        client.release();
    }
};

const getTopSellingProducts = async (req, res) => {
    const client = await pool.connect();

    try {
        // Quey to get top 10 selling products for the current months
        const result = await client.query(`
            WITH TopSellingProducts AS (
        SELECT 
            p.productid,
            p.productname,
            SUM(d.quantity) AS quantity
        FROM 
            public.Orders o
        JOIN
            public.OrderDetail d ON o.orderid = d.orderid
        JOIN 
            public.Product p ON d.productid = p.productid
        WHERE 
            date_trunc('month', o.orderdate) = date_trunc('month', CURRENT_DATE) AND o.OrderStatus != 'Refuse'
        GROUP BY 
            p.productid, p.productname
    ),
    GroupByTopSellingProducts AS (
        SELECT 
            p.productid,
            p.productname,
            SUM(d.quantity) AS quantity
        FROM 
            public.Orders o
        JOIN
            public.OrderDetail d ON o.orderid = d.orderid
        JOIN
            public.GroupByProduct g ON g.groupbyid = d.groupbyid
        JOIN 
            public.Product p ON g.productid = p.productid
        WHERE 
            date_trunc('month', o.orderdate) = date_trunc('month', CURRENT_DATE) AND o.OrderStatus != 'Refuse'
        GROUP BY 
            p.productid, p.productname
    ),
        CombinedProducts AS (
            SELECT * FROM TopSellingProducts
            UNION ALL
            SELECT * FROM GroupByTopSellingProducts
        )
        SELECT 
            cp.productid,
            cp.productname,
            SUM(cp.quantity) AS quantity,
            p.currentprice AS price,
            SUM(cp.quantity * p.currentprice) AS value
        FROM 
            CombinedProducts cp
        JOIN 
            public.Product p ON cp.productid = p.productid
        GROUP BY 
            cp.productid, cp.productname, p.currentprice
        ORDER BY 
            quantity DESC
        LIMIT 10;
        `);

        return {
            dataMonthlySales: result.rows
        };
    } catch (error) {
        console.error('Error querying!', error);
        res.status(500).json({ error: 'Error fetching data.' });
    } finally {
        client.release();
    }
};

module.exports = {
    getTotalUsers,
    getTotalRevenue,
    getTopSellingProducts
}