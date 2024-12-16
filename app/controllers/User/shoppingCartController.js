const ShoppingCartModel = require('../../models/User/shoppingCartModel');

class ShoppingCartController {

    // [GET] /shopping-cart
    index(req, res) {
        res.render('User/shopping-cart', {
            layout: 'layoutUser', title: 'Shopping',
            customHead: `
                    <link rel="stylesheet" href="User/shoppingCart.css">
                    `
        });
    }

    // [POST] /shopping-cart/add
    async add(req, res) {
        const { ProductID } = req.body; // Lấy email và password từ request
        console.log(ProductID);

        if (!req.session.user) {
            console.log('Chưa đăng nhập');
            return res.json({ success: false, message: 'Vui lòng đăng nhập để thực hiện hành động!' });
        }
        else {

            console.log(req.session.user.userid)
        }

        try {
            const result = await ShoppingCartModel.addProductToShoppingCart(req.session.user.userid, ProductID);

            if (result) {
                console.log('Thêm vào giỏ hàng thành công!');
                return res.json({ success: true, message: 'Thêm vào giỏ hàng thành công!' });
            } else {
                console.log('Thêm vào giỏ hàng thất bại');
                return res.json({ success: false, message: 'Thêm vào giỏ hàng thất bại!' });
            }
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi đăng nhập' });
        }
    };

    // [GET] /shopping-cart/get
    async get(req, res) {
        if (!req.session.user) {
            console.log('Chưa đăng nhập');
            return res.json({ success: false, message: 'Vui lòng đăng nhập để thực hiện hành động!' });
        }
        else {
            console.log(req.session.user.userid)
        }

        try {
            const listCart = await ShoppingCartModel.getAllProductsInCart(req.session.user.userid);
            return res.json({ success: true, listCart: listCart, message: 'Thêm vào giỏ hàng thành công!' });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi đăng nhập' });
        }
    };

    // [POST] /shopping-cart/change
    async change(req, res) {
        const { ProductID, Quantity } = req.body; // Lấy email và password từ request
        console.log(ProductID, Quantity);

        if (!req.session.user) {
            console.log('Chưa đăng nhập');
            return res.json({ success: false, message: 'Vui lòng đăng nhập để thực hiện hành động!' });
        }
        else {

            console.log(req.session.user.userid)
        }

        try {
            const rs = await ShoppingCartModel.updateProductQuantity(req.session.user.userid, ProductID, parseInt(Quantity));
            if (rs) {
                const listCart = await ShoppingCartModel.getAllProductsInCart(req.session.user.userid);
                return res.json({ success: true, listCart: listCart, message: 'Thêm vào giỏ hàng thành công!' });
            }
            console.log('Thêm vào giỏ hàng thất bại');
            return res.json({ success: false, message: 'Thêm vào giỏ hàng thất bại!' });

        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi đăng nhập' });
        }
    };

}

module.exports = new ShoppingCartController;