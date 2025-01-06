const {searchProduct, checkGroupByProduct} = require('../../models/User/SearchProductModel');

const controller ={}

controller.showSearchProduct = (req, res) => {
    const user = req.session.user;
    res.render('User/ProductPage', {layout: 'layoutUser', title: 'Search Product', 
        searchQuery: req.query.search || '',
        customHead: `
        <link rel="stylesheet" href="User/ProductPage.css">
        <script defer type="module" src="User/SearchProduct/searchProduct.js"></script>
        <link rel="stylesheet" href="User/home.css">
        `,
        user: user
    });
} 

// Search Product
controller.searchProduct = async (req, res) => {
    const search = req.query.search;
    const visibleCount = req.query.visibleCount;

    try {
        const data = await searchProduct(search, visibleCount);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
}

controller.checkGroupByProduct = async (req, res) => {
    const productid = req.query.productid;

    try {
        const result = await checkGroupByProduct(productid);
        res.json(result);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
}

module.exports = controller;