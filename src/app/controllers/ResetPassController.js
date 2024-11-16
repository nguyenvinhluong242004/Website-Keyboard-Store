const pool = require('../config/database');
const dataTempServer = require('../../index');
const authPass = require('../models/AuthPass');


class ResetPassController {

    // [GET] /reset-password
    index(req, res) {
        res.render('reset-password');
    }
    
    // [POST] /reset-password/api
    async callAPIResetPass(req, res){
        const { newPassword, confirmNewPassword, verificationCode, timeCode } = req.body; // Lấy email, mật khẩu mới và mã xác thực từ yêu cầu
        console.log(dataTempServer.storedEmail, newPassword, confirmNewPassword, verificationCode, timeCode, dataTempServer.storedCode);
        try {
            // Kiểm tra tài khoản có tồn tại và mã xác thực đúng
            const result = await pool.query(`
                SELECT *
                FROM AccountNormal 
                WHERE email = $1`,
                [dataTempServer.storedEmail]);

            if (result.rows.length === 0) {
                console.log('Tài khoản không tồn tại');
                return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });
            }

            // Nếu mã xác thực không đúng, trả về lỗi
            if (String(verificationCode) !== String(dataTempServer.storedCode)) {
                console.log('Mã xác thực không đúng');
                return res.status(400).json({ success: false, message: 'Mã xác thực không đúng' });
            }

            // Nếu xác nhận mật khẩu mới không đúng, trả về lỗi
            if (String(newPassword) !== String(confirmNewPassword)) {
                console.log('Xác nhận mật khẩu mới không đúng');
                return res.status(400).json({ success: false, message: 'Xác nhận mật khẩu mới không đúng' });
            }

            // Nếu mã xác thực đúng, mã hết hạn
            if (timeCode <= 0) {  // Giả sử `storedCode` là mã đã được lưu
                console.log('Mã xác thực hết hạn');
                return res.status(400).json({ success: false, message: 'Mã xác thực hết hạn' });
            }

            const hashedNewPassword = await authPass.hashPassword(newPassword);

            // Cập nhật mật khẩu mới trong cơ sở dữ liệu
            await pool.query(`
                UPDATE AccountNormal 
                SET password = $1 
                WHERE email = $2`,
                [hashedNewPassword, dataTempServer.storedEmail]);

            console.log('Đặt lại mật khẩu thành công');
            res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi đặt lại mật khẩu' });
        }
    }

}

module.exports = new ResetPassController;