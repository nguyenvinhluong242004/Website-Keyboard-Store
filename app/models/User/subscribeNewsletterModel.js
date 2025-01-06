const pool = require('../../config/database');

const subscribeNewsletter = async (email) => {

    try {
        // Query to insert email into database
        await pool.query(`
            INSERT INTO public.emailforreceivinginfo(email)
            VALUES ($1)
        `, [email]);

        return ({message: 'Thank you for subscribing to our newsletter!'});
    } catch (error) {
        console.error('Lỗi truy vấn!', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy dữ liệu.' });
    }
};

module.exports = {
    subscribeNewsletter,
};