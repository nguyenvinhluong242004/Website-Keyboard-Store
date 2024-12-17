const {searchProduct} = require('../../models/User/SearchProductModel');

const controller ={}

controller.showSearchProduct = (req, res) => {
    res.render('User/ProductPage', {layout: 'layoutUser', title: 'Search Product', 
        searchQuery: req.query.search || '',
        customHead: `
        <link rel="stylesheet" href="User/ProductPage.css">
        <script defer type="module" src="User/SearchProduct/searchProduct.js"></script>
        <link rel="stylesheet" href="User/home.css">
        `
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

module.exports = controller;