const AccountModel = require('../../models/User/accountModel');

class AccountController {

    // [GET] /account
    index(req, res) {
        res.render('User/account', {
            layout: 'layoutUser', title: 'Account',
            customHead: `
            <link rel="stylesheet" href="User/LoginStyle.css">
            <script defer type="module" src="User/Login/app.js"></script>
            `
        });
    }

    // [POST] /account/get-info/api
    async callAPIAccountGetInfo(req, res) {
        console.log(req.session.user)
        return res.json({ success: true, dataUser: req.session.user, message: 'Gửi thông tin account' });
    }

    // [POST] /account/change-info/api
    async callAPIAccountChangeInfo(req, res) {
        const { username, sdt, email } = req.body;
        console.log(username, sdt, email); // Kiểm tra các giá trị
        console.log(req.body); // Kiểm tra cấu trúc của req.body
        req.session.email = email;


        let storedEmail = req.session.email;
        try {
            // Kiểm tra tài khoản có tồn tại và mã xác thực đúng
            console.log(storedEmail)
            const existingUser = await AccountModel.findAccountByEmail(storedEmail);
            console.log(existingUser)
            if (!existingUser) {
                console.log('Tài khoản không tồn tại');
                return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });
            }
            console.log(sdt)

            await AccountModel.changeInfoByEmail(storedEmail, username, sdt)

            console.log('Đặt lại thông tin thành công');
            req.session.email = email;
            storedEmail = email;

            const data_ = await AccountModel.getInforAccountByEmail(storedEmail);

            req.session.user = data_;

            res.json({ success: true, message: 'Đặt lại thông tin thành công' });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi đặt lại thông tin.' });
        }
    };

}

module.exports = new AccountController;