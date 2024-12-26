const { use } = require('passport');
const {getGroupByProduct} = require('../../models/User/groupByModel');

const controller ={}

//Render groupBy page
controller.showGroupByProduct = (req, res) => {
    const user = req.session.user;
    res.render('User/ProductPage', {layout: 'layoutUser', title: 'GroupBy',
        customHead: `
        <link rel="stylesheet" href="User/ProductPage.css">
        <script defer type="module" src="User/GroupBy/GroupBy.js"></script>
        <link rel="stylesheet" href="User/home.css">
        `,
        user: user
     });
};

//Get groupBy
controller.getGroupByProduct = async (req, res) => {
    try {
        const data = await getGroupByProduct(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
};

module.exports = controller;