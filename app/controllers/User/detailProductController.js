const controller ={}

// Render Kit Phim
controller.showDetailProduct = (req, res) => {
    res.render('detail-product', {layout: 'layout', title: 'DetailProduct',
        customHead: `
        <link rel="stylesheet" href="User/DetailProduct/detail-product.css">
        <script src="User/DetailProduct/product.js"></script>
        `
     });
};


module.exports = controller;
