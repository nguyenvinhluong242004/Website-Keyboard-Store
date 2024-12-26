const AccountModel = require('../../models/User/accountModel');
const authPass = require('../../config/AuthPass');

class LoginController {

    // [GET] /login
    index(req, res) {
        const user = req.session.user;
        res.render('User/login', {
            layout: 'layoutUser', title: 'Login',
            customHead: `
            <link rel="stylesheet" href="User/LoginStyle.css">
            <script defer type="module" src="User/Login/app.js"></script>
            `,
            user: user
        });
    }

    // [POST] /login/api
    async callAPILogin(req, res) {
        const { loginEmail, loginPassword } = req.body; // Lấy email và password từ request

        try {
            // Kiểm tra tài khoản có tồn tại trong cơ sở dữ liệu
            const existingUser = await AccountModel.findAccountByEmail(loginEmail);

            if (existingUser) {
                const isMatch = await authPass.verifyPassword(loginPassword, existingUser.passwordorgoogleid);
                console.log(loginPassword, existingUser.passwordorgoogleid)
                if (isMatch) {
                    const data_ = await AccountModel.getInforAccountByEmail(loginEmail);
                    
                    req.session.user = data_;

                    console.log('Đăng nhập thành công');
                    return res.json({ success: true, message: 'Đăng nhập thành công' });
                } else {
                    // Nếu mật khẩu không đúng
                    console.log('Email hoặc mật khẩu không đúng');
                    return res.json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
                }
            } else {
                console.log('Email không tồn tại');
                return res.json({ success: false, message: 'Email không tồn tại' });
            }
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi đăng nhập' });
        }
    };

}

module.exports = new LoginController;