const pool = require('../config/database');
const dataTempServer = require('../../index');

class AccountController {

    // [GET] /account
    index(req, res){
        res.render('account');
    }

    // [POST] /account/get-info/api
    async callAPIAccountGetInfo(req, res){
    console.log(dataTempServer.dataUser)
    return res.json({ success: true, dataUser: dataTempServer.getDataUser(), message: 'Gửi thông tin account' });
    }

    // [POST] /account/change-info/api
    async callAPIAccountChangeInfo(req, res){
        const { username, sdt, email, address } = req.body;
        console.log(username, sdt, email, address); // Kiểm tra các giá trị
        console.log(req.body); // Kiểm tra cấu trúc của req.body
        dataTempServer.setStoredEmail(email);


        let storedEmail = dataTempServer.storedEmail; 
        try {
            // Kiểm tra tài khoản có tồn tại và mã xác thực đúng
            const result = await pool.query(`
                SELECT *
                FROM AccountNormal 
                WHERE email = $1`,
                [storedEmail]);

            if (result.rows.length === 0) {
                console.log('Tài khoản không tồn tại');
                return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });
            }

            // Cập nhật thông tin người dùng trong cơ sở dữ liệu
            await pool.query(`
                UPDATE AccountNormal 
                SET email = $1 
                WHERE email = $2`,
                [email, storedEmail]
            );
            await pool.query(`
                UPDATE InforAccounts 
                SET email = $1, username = $2, sdt = $3, address = $4 
                WHERE email = $5`,
                [email, username, sdt, address, storedEmail]
            );

            console.log('Đặt lại thông tin thành công');
            dataTempServer.setStoredEmail(email);
            storedEmail = email;
            const data_ = await pool.query(`
                SELECT * 
                FROM InforAccounts 
                WHERE email = $1`,
                [storedEmail]);
            dataTempServer.setDataUser(data_.rows[0]);
            res.json({ success: true, message: 'Đặt lại thông tin thành công' });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi đặt lại thông tin.' });
        }
    };

}

module.exports = new AccountController;