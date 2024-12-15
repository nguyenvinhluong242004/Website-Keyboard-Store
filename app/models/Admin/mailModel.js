const pool = require('../../config/database');

const getAllEmail = async () => {
    const client = await pool.connect();
    try {
        const totalResult = await client.query(`SELECT COUNT(*) FROM public.product`);
        const dataResult = await client.query(`
            SELECT 
                e.*
            FROM 
                public.emailforreceivinginfo e
        `);

        return {
            totalEmails: parseInt(totalResult.rows[0].count, 10),
            data: dataResult.rows,
        };
    } catch (error) {
        console.error('Lỗi truy vấn tất cả email:', error);
        throw error; // Ném lỗi để controller xử lý
    } finally {
        client.release();
    }
};

module.exports = {
    getAllEmail,
};