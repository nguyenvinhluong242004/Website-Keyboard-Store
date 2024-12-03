const { getProduct } = require('../../models/User/get_product.js');
const controller = {};

// Render Kit Phim 
controller.showDetailProduct = async (req, res) => {
    try {
        // Lấy dữ liệu từ model
        const data = await getProduct(req, res);

        // Render view với dữ liệu
        res.render('detail-product', {
            layout: 'layout',
            title: 'DetailGroupby',
            customHead: `
                <link rel="stylesheet" href="User/DetailProduct/detail-product.css">
                <script defer src="User/DetailProduct/product.js"></script>
            `,
            data: JSON.stringify(data) // Chuyển dữ liệu sang JSON để Vue.js sử dụng
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Error fetching data: ' + error.message);
    }
};

module.exports = controller;
