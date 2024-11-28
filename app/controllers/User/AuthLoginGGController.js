const AccountProvider = require('../../models/User/AccountProvider');
const passport = require('../../config/passport');
const dataTempServer = require('../../../index');

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

            const result = await AccountProvider.findAccountByEmailAndGoogleID(user.email, user.googleId);

            if (result) {
                console.log('Đăng nhập lại thành công');
            } else {
                console.log('Chưa có dữ liệu');
                // Thêm tài khoản mới vào cơ sở dữ liệu
                await AccountProvider.addUserIntoDataBase(user.displayName, user.email, user.googleId, 'Google');
            }

            const data_ = await AccountProvider.getInforAccountByEmail(user.email);
            dataTempServer.setDataUser(data_);

            res.redirect('/account'); // Chuyển hướng sau khi đăng nhập thành công
        })(req, res, next);
    }

}

module.exports = new AuthLoginGGController;
