const { getAllEmail, sendEmails } = require('../../models/Admin/mailModel');

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

            if (!emails || emails.length === 0) {
                return res.status(400).json({ error: "No emails selected." }); // Đảm bảo phản hồi là JSON
            }

            // Gọi hàm từ model để gửi email
            const sendResult = await sendEmails(emails, subject, message);

            return res.status(200).json({ message: "Emails sent successfully", result: sendResult });
        } catch (error) {
            console.error("Error sending emails:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Trả về lỗi JSON
        }
    },    
};

module.exports = productController;
