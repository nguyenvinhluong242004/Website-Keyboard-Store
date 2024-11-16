const pool = require('../config/database');
const nodemailer = require('nodemailer'); // Thư viện gửi email
const dataTempServer = require('../../index');

// Cấu hình transporter cho nodemailer để gửi email qua Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Email người gửi
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng
    },
});

class ConfirmPassController {

    // [GET] /confirm-mail
    index(req, res) {
        res.render('confirm-mail');
    }
    
    // [POST] /confirm-mail/send-code/api
    sendCode(req, res){
        if (req.body.status){ // status: true --> lấy từ input
            console.log("yes")
            dataTempServer.setStoredEmail(req.body.email.toString()); // Lấy email từ yêu cầu
            console.log(req.body.email.toString());
        }
        dataTempServer.setStoredCode(Math.floor(100000 + Math.random() * 900000)); // Tạo mã xác thực ngẫu nhiên

        console.log('Email:', dataTempServer.storedEmail);
        console.log('Email User:', process.env.EMAIL_USER);
        console.log('Email Password:', process.env.EMAIL_PASS);

        // Gửi mã xác thực qua email
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: dataTempServer.storedEmail,
            subject: 'Mã xác thực của bạn',
            text: `Mã xác thực của bạn là: ${dataTempServer.storedCode}`,
        }, (error, info) => {
            if (error) {
                return res.status(500).send({ message: 'Gửi email thất bại' });
            }
            res.status(200).json({ success: true, message: 'Gửi mã thành công' });
        });
    };

}

module.exports = new ConfirmPassController;