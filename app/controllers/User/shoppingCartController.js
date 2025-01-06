const shoppingCartModel = require('../../models/User/shoppingCartModel');
const ShoppingCartModel = require('../../models/User/shoppingCartModel');

class ShoppingCartController {

    // [GET] /shopping-cart
    index(req, res) {
        const user = req.session.user;
        res.render('User/shopping-cart', {
            layout: 'layoutUser', title: 'Shopping',
            customHead: `
                    <link rel="stylesheet" href="User/shoppingCart.css">
                    `,
            user: user
        });
    }

    // [POST] /shopping-cart/add
    async add(req, res) {
        const { ProductID, Quantity = 1 } = req.body; // Lấy email và password từ request
        console.log( 'sản phẩm thêm vào giỏ hàng:',ProductID, Quantity);

        if (Quantity < 1) {
            return res.json({ success: false, message: 'Số lượng sản phẩm thêm vào không hợp lệ' });
        }


        if (!req.session.user) {
            console.log('Chưa đăng nhập');
            return res.json({ success: false, message: 'Vui lòng đăng nhập để thực hiện hành động!' });
        }
        else {

            console.log(req.session.user.userid)
        }

        try {
            const pro = await ShoppingCartModel.getInfomation(ProductID);
            if (pro.quantity === 0) {
                console.log('Sản phẩm tạm đang hết hàng!')
                return res.json({ success: false, message: `Sản phẩm tạm đang hết hàng!` });
            }
            const proCart = await ShoppingCartModel.getProductToShoppingCart(req.session.user.userid, ProductID);
            if (proCart) {
                if (Quantity + proCart.quantity > pro.quantity) {
                    console.log('Vượt quá số lượng có sẵn!')
                    return res.json({ success: false, message: `Vượt quá số lượng có sẵn! Tối đa được thêm: ${pro.quantity - proCart.quantity}` });
                }
            }
            if (Quantity > pro.quantity) {
                console.log('Vượt quá số lượng có sẵn!')
                return res.json({ success: false, message: `Vượt quá số lượng có sẵn! Tối đa được thêm: ${pro.quantity}` });
            }
            const result = await ShoppingCartModel.addProductToShoppingCart(req.session.user.userid, ProductID, Quantity);

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
            const pro = await ShoppingCartModel.getInfomation(ProductID);
            if (Quantity > pro.quantity) {
                console.log('Vượt quá số lượng có sẵn!')
                return res.json({ success: false, message: `Vượt quá số lượng có sẵn! Tối đa: ${pro.quantity}` });
            }

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