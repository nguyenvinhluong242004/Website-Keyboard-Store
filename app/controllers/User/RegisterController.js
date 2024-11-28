const AccountProvider = require('../../models/User/AccountProvider');
const authPass = require('../../config/AuthPass');

class RegisterController {

    // [GET] /register
    index(req, res){
        res.render('register', {
            layout: 'layout', title: 'Register',
            customHead: `
            <link rel="stylesheet" href="User/LoginStyle.css">
            <script defer type="module" src="User/Login/app.js"></script>
            `
        });
    }

    // [POST] /register/api
    async callAPIRegister(req, res){
        const { signupEmail, signupPassword } = req.body;

        const hashedSignupPassword = await authPass.hashPassword(signupPassword);

        try {
            // Kiểm tra email đã tồn tại chưa
            const existingUser = await AccountProvider.findAccountByEmail(signupEmail);

            if (existingUser) {
                // Nếu email đã tồn tại, trả về lỗi
                return res.json({ success: false, message: 'Email này đã được đăng ký.' });
            }

            // Thêm tài khoản mới vào cơ sở dữ liệu
            await AccountProvider.addUserIntoDataBase('null', signupEmail, hashedSignupPassword, 'Email');

            res.json({ success: true, message: 'Đăng ký thành công' }); // Phản hồi đăng ký thành công
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi đăng ký' });
        }
    };

}

module.exports = new RegisterController;