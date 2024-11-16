const pool = require('../config/database');
const passport = require('../config/passport');
const dataTempServer = require('../../index');

class AuthLoginGGController {
    
    // [GET] /auth/google
    LoginGoogle(req, res, next) {
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            prompt: 'select_account'
        })(req, res, next); // Thực thi authenticate dưới dạng middleware
    }

    // [GET] /auth/google/callback
    LoginGoogleCallback(req, res, next) {
        passport.authenticate('google', { failureRedirect: '/login' }, async (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/login');
            }

            // Xử lý khi đã đăng nhập thành công
            console.log('Thông tin tài khoản Google:', user);

            const result = await pool.query(`
                SELECT * 
                FROM AccountGoogle 
                WHERE email = $1 AND googleId = $2`,
                [user.email, user.googleId]
            );

            if (result.rows.length > 0) {
                console.log('Đăng nhập lại thành công');
            } else {
                console.log('Chưa có dữ liệu');
                // Thêm tài khoản mới vào cơ sở dữ liệu
                await pool.query(`
                    INSERT INTO AccountGoogle(email, googleId) 
                    VALUES($1, $2)`,
                    [user.email, user.googleId]
                );
                await pool.query(`
                    INSERT INTO InforAccounts(email, username, sdt, address) 
                    VALUES($1, $2, $3, $4)`,
                    [user.email, user.displayName, "null", "null"]
                );
            }

            const data_ = await pool.query(`
                SELECT * 
                FROM InforAccounts 
                WHERE email = $1`,
                [user.email]
            );
            dataTempServer.setDataUser(data_.rows[0]);

            res.redirect('/account'); // Chuyển hướng sau khi đăng nhập thành công
        })(req, res, next);
    }

}

module.exports = new AuthLoginGGController;
