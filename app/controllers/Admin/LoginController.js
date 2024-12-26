const AccountProvider = require('../../models/Admin/AccountModel');
const authPass = require('../../config/AuthPass');

class LoginController {

    // [GET] /login
    index(req, res) {
        res.render('Admin/login', {
            layout: 'layoutAdmin', title: 'Login',
            customHead: `
            <link rel="stylesheet" href="/Admin/Login/style.css">
            `
        });
    }

    // [GET] /login
    logout(req, res) {
        req.session.admin = null;
        return res.redirect('/admin/login');
    }

    // [POST] /login/api
    async callAPILogin(req, res) {
        const { email, password } = req.body; // Lấy email và password từ request

        console.log(req.body)
        console.log(email, password)

        try {
            // Kiểm tra tài khoản có tồn tại trong cơ sở dữ liệu
            const existingUser = await AccountProvider.findAccountAdmin(email);

            if (existingUser) {
                const isMatch = await authPass.verifyPassword(password, existingUser.password);
                console.log(password, existingUser.password)
                if (isMatch) {
                    
                    req.session.admin = existingUser;

                    console.log('Đăng nhập thành công');
                    return res.json({ success: true, admin: req.session.admin, message: 'Đăng nhập thành công' });
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