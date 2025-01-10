const pool = require('../../config/database');

const getTotalUsers = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT COUNT(*) FROM public.Users
        `);

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

const getChartRevenue = async (req, res) => {
    const month = req.query.month;
    const year = req.query.year;

    const client = await pool.connect();
    try {
        const startDate = new Date(year, month - 1, 1); // First day of the month
        const endDate = new Date(year, month, 0); // Last day of the month

        const result = await client.query(`
            SELECT SUM(totalamount) AS totalRevenue FROM public.Orders
            WHERE orderdate >= $1 AND orderdate <= $2 AND OrderStatus != 'Refuse'
        `, [startDate, endDate]);
        
        return {
            totalRevenue: result.rows[0].totalrevenue || 0 // Return 0 if no revenue
        }
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
    getChartRevenue
}