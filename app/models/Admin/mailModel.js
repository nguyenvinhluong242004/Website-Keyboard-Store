const pool = require('../../config/database');
const nodemailer = require('nodemailer');

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

const sendEmails = async (emails, subject, message) => {
    if (!emails || emails.length === 0) {
        throw new Error("No emails selected."); // Ném lỗi nếu không có email nào được chọn
    }

    // Cấu hình Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Tạo danh sách các lời hứa gửi email
    const mailPromises = emails.map(email => 
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email, // test ở đây, thay bằng "to: email" nếu không test
            subject: subject || "No Subject",
            text: message || "No Content",
        })
    );

    // Chờ tất cả email được gửi
    await Promise.all(mailPromises);
};

module.exports = {
    getAllEmail,
    sendEmails,
};