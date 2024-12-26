const AccountModel = require('../../models/User/accountModel');
const authPass = require('../../config/AuthPass');


class ResetPassController {

    // [GET] /reset-password
    index(req, res) {
        const user = req.session.user;
        res.render('User/reset-password', {
            layout: 'layoutUser', title: 'Changge Password',
            customHead: `
            <link rel="stylesheet" href="User/LoginStyle.css">
            <script defer type="module" src="User/Login/app.js"></script>
            `,
            user: user
        });
    }
    
    // [POST] /reset-password/api
    async callAPIResetPass(req, res){
        const { newPassword, confirmNewPassword, verificationCode, timeCode } = req.body; // Lấy email, mật khẩu mới và mã xác thực từ yêu cầu
        console.log(req.session.email, newPassword, confirmNewPassword, verificationCode, timeCode, req.session.code);
        try {
            // Kiểm tra tài khoản có tồn tại và mã xác thực đúng
            const existingUser = await AccountModel.findAccountByEmail(req.session.email);

            if (!existingUser) {
                console.log('Tài khoản không tồn tại');
                return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });
            }

            // Nếu mã xác thực không đúng, trả về lỗi
            if (String(verificationCode) !== String(req.session.code)) {
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

            await AccountModel.changePasswordByEmail(req.session.email, hashedNewPassword);

            console.log('Đặt lại mật khẩu thành công');
            res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi đặt lại mật khẩu' });
        }
    }

}

module.exports = new ResetPassController;