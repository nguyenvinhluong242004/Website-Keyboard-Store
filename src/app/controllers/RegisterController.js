const pool = require('../config/database');
const authPass = require('../models/AuthPass');

class RegisterController {

    // [GET] /register
    index(req, res){
        res.render('register');
        console.log(req.query.q);
    
        // Truy vấn dữ liệu từ bảng Account
        pool.query(`
            SELECT * 
            FROM AccountNormal`,
            (err, result) => {
                if (err) {
                    return console.error('Truy vấn thất bại!', err);
                }
                console.log('Dữ liệu người dùng:', result.rows);
            });
    }

    // [POST] /register/api
    async callAPIRegister(req, res){
        const { signupEmail, signupPassword } = req.body;

        const hashedSignupPassword = await authPass.hashPassword(signupPassword);

        try {
            // Kiểm tra email đã tồn tại chưa
            const existingUser = await pool.query(`
                SELECT *
                FROM AccountNormal 
                WHERE email = $1`,
                [signupEmail]);

            if (existingUser.rows.length > 0) {
                // Nếu email đã tồn tại, trả về lỗi
                return res.json({ success: false, message: 'Email này đã được đăng ký.' });
            }

            // Thêm tài khoản mới vào cơ sở dữ liệu
            await pool.query(`
                INSERT INTO AccountNormal(email, password) 
                VALUES($1, $2)`,
                [signupEmail, hashedSignupPassword]);
            await pool.query(`
                INSERT INTO InforAccounts(email, username, sdt, address) 
                VALUES($1, $2, $3, $4)`,
                [signupEmail, "null", "null", "null"]);

            res.json({ success: true, message: 'Đăng ký thành công' }); // Phản hồi đăng ký thành công
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi đăng ký' });
        }
    };

}

module.exports = new RegisterController;