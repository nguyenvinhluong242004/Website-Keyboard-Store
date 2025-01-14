const express = require('express');
const router = express.Router();

// Các route cần thiết
const loginRouter = require('./login.route');
const registerRouter = require('./register.route');
const accountRouter = require('./account.route');
const homepageRouter = require('./homepage.route');
const confirmMailRouter = require('./confirmMail.route');
const resetPassRouter = require('./resetPass.route');
const authLoginGGRouter = require('./authLoginGG.route');

const kitPhimRouter = require('./kitPhim.route');
const keCapRouter = require('./keCap.route');
const switchRouter = require('./switch.route');
const deskpadsRouter = require('./deskpads.route');
const suppliesRouter = require('./supplies.route');
const merchRouter = require('./merch.route');
const groupByRouter = require('./groupBy.route');
const serviceRouter = require('./service.route'); 
const introductionRouter = require('./introduction.route');
const detailGroupbyRouter = require('./detailGroupby.route');
const detailProductRouter = require('./detailProduct.route');
const searchProductRouter = require('./searchProduct.route');
const subscribeNewsletter = require('./subscribeNewsletter.route');

const shoppingCartRouter = require('./shoppingCart.route');
const paymentRouter = require('./payment.route');
const Fetch = require('./pathImage.route');

const errorProductNotFoundRouter = require('./errorProductNotFound.route');

// ---------------------------------------------------------

router.use('/account',  (req, res, next) => {
    console.log(req.session.user)
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
});

// Route cho trang chủ
router.use('/', homepageRouter); // Trang chủ của user

// Các route liên quan đến tài khoản và đăng nhập
router.use('/login', loginRouter); // Đăng nhập
router.use('/register', registerRouter); // Đăng ký
router.use('/account', accountRouter); // Trang tài khoản
router.use('/confirm-mail', confirmMailRouter); // Xác nhận email
router.use('/reset-password', resetPassRouter); // Quên mật khẩu
router.use('/auth/google', authLoginGGRouter); // Đăng nhập với Google

// Các route liên quan đến các trang sản phẩm và dịch vụ
router.use('/kitPhim', kitPhimRouter); // Kit phim
router.use('/keCap', keCapRouter); // Ke Cap
router.use('/switch', switchRouter); // Switch
router.use('/deskpads', deskpadsRouter); // Phụ kiện
router.use('/supplies', suppliesRouter); // Bàn phím
router.use('/merch', merchRouter); // Merch
router.use('/group-by-product', groupByRouter); // Nhóm sản phẩm
router.use('/service', serviceRouter); // Dịch vụ
router.use('/introduction', introductionRouter); // Giới thiệu
router.use('/detail-group-by', detailGroupbyRouter); // Chi tiết nhóm sản phẩm
router.use('/detail-product', detailProductRouter); // Chi tiết sản phẩm
router.use('/search', searchProductRouter); 
router.use('/subscribe-news-letter', subscribeNewsletter)

//Giỏ hàng

router.use('/shopping-cart', shoppingCartRouter); // Chi tiết giỏ hàng

//show error for not found product when search
router.use('/error', errorProductNotFoundRouter);

// Payment
router.use('/payment', paymentRouter);

//get path image

router.use('/api', Fetch);


module.exports = router;
