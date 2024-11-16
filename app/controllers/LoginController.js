const pool = require('../config/database');
const dataTempServer = require('../../index');
const authPass = require('../models/AuthPass');

class LoginController {

    // [GET] /login
    index(req, res) {
        res.render('login');
    }

    // [POST] /login/api
    async callAPILogin(req, res) {
        const { loginEmail, loginPassword } = req.body; // Lấy email và password từ request

        try {
            // Kiểm tra tài khoản có tồn tại trong cơ sở dữ liệu
            const result = await pool.query(`
                SELECT * 
                FROM AccountNormal 
                WHERE email = $1`,
                [loginEmail]);

            if (result.rows.length > 0) {
                const isMatch = await authPass.verifyPassword(loginPassword, result.rows[0].password);
                if (isMatch) {
                    const data_ = await pool.query(`
                        SELECT * 
                        FROM InforAccounts 
                        WHERE email = $1`,
                        [loginEmail]);
                    dataTempServer.setDataUser(data_.rows[0]);

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