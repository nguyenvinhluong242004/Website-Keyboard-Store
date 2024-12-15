const { getAllEmail } = require('../../models/Admin/mailModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

const productController = {
    sendMail: async (req, res) => {
        try {
            const Emails = await getAllEmail();

            res.render("Admin/sendMail", {
                layout: 'layoutAdmin', 
                title: 'Send Mail',
                customHead: `
                    <link rel="stylesheet" href="/Admin/Mail/sendMail.css">
                    <script defer type="module" src="/Admin/Mail/sendMail.js"></script>
                `,
                Emails,
            });
        } catch (error) {
            console.error("Error rendering send mail page:", error);
            res.status(500).send("Internal Server Error");
        }
    },

    handleSendMail: async (req, res) => {
        try {
            const { emails, subject, message } = req.body;
    
            // Kiểm tra dữ liệu gửi từ client
            if (!emails || emails.length === 0) {
                return res.status(400).json({ error: "No emails selected." });
            }
    
            // Cấu hình Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
    
            // Gửi email cho từng người
            const mailPromises = emails.map(email =>
                transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: "nguyenvo122005@gmail.com", // không test nữa thì thay lại bằng "to: email,"
                    subject: subject || "No Subject",
                    text: message || "No Message",
                })
            );
    
            await Promise.all(mailPromises);
    
            return res.status(200).json({ message: "Emails sent successfully." });
        } catch (error) {
            console.error("Error sending emails:", error);
            return res.status(500).json({ error: "Failed to send emails." });
        }
    },    
};

module.exports = productController;
