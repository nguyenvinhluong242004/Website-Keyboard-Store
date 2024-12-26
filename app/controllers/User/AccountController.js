const AccountModel = require('../../models/User/accountModel');

class AccountController {

    // [GET] /account
    index(req, res) {
        const user = req.session.user;
        res.render('User/account', {
            layout: 'layoutUser', title: 'Account',
            customHead: `
            <link rel="stylesheet" href="User/LoginStyle.css">
            <script defer type="module" src="User/Login/app.js"></script>
            `,
            user: user
        });
    }

    // [POST] /account/logout
    async callAPIAccountLogout(req, res) {
        req.session.user = null;
        return res.json({ success: true, message: 'Đăng xuất' });
    }

    // [POST] /account/get-info/api
    async callAPIAccountGetInfo(req, res) {
        console.log(req.session.user)
        return res.json({ success: true, dataUser: req.session.user, message: 'Gửi thông tin account' });
    }

    // [POST] /account/change-info/api
    async callAPIAccountChangeInfo(req, res) { 
        const { userid, username, phone, email } = req.body;
        console.log(userid, username, phone, email); // Kiểm tra các giá trị
        console.log(req.body); // Kiểm tra cấu trúc của req.body

        try {
            if (email !== req.session.user.email) {
                const existingUser = await AccountModel.findAccountByEmail(email);
                console.log(existingUser)
                if (!existingUser) {
                    console.log('Email đã tồn tại');
                    return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });
                }
            }

            console.log(phone);

            await AccountModel.changeInfoByEmail(userid, email, username, phone)

            console.log('Đặt lại thông tin thành công');
            req.session.email = email;

            const data_ = await AccountModel.getInforAccountByEmail(email);

            req.session.user = data_;

            res.json({ success: true, message: 'Đặt lại thông tin thành công', dataUser: data_, });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi đặt lại thông tin.' });
        }
    };

    // [POST] /account/get-address/api
    async callAPIAccountGetAddress(req, res) {
        console.log(req.session.user)
        const data_ = await AccountModel.getAllAddress(req.session.user.userid);
        console.log(data_)
        return res.json({ success: true, data: data_, message: 'Gửi thông tin address' });
    }

    // [POST] /account/add-address/api
    async callAPIAccountAddAddress(req, res) { 
        const { id, province, district, ward, street } = req.body;
        console.log(id, province, district, ward, street); // Kiểm tra các giá trị
        console.log(req.body); // Kiểm tra cấu trúc của req.body

        try {
            await AccountModel.addOrUpdateAddress(id, req.session.user.userid, province, district, ward, street);

            const data_ = await AccountModel.getAllAddress(req.session.user.userid);
            return res.json({ success: true, data: data_, message: 'Gửi thông tin address' });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi đặt lại thông tin.' });
        }
    };

    // [POST] /account/add-address/api
    async callAPIAccountDeleteAddress(req, res) { 
        const { id } = req.body;
        console.log(id); // Kiểm tra các giá trị
        console.log(req.body); // Kiểm tra cấu trúc của req.body

        try {
            await AccountModel.deleteAddressById(id);

            const data_ = await AccountModel.getAllAddress(req.session.user.userid);
            return res.json({ success: true, data: data_, message: 'Gửi thông tin address' });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi đặt lại thông tin.' });
        }
    };

}

module.exports = new AccountController;