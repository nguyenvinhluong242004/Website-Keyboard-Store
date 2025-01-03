const {getSupplies} = require('../../models/User/suppliesModel');

const controller ={}

//Render Supplies
controller.showSupplies = (req, res) => {
    const user = req.session.user;
    res.render('User/ProductPage', {layout: 'layoutUser', title: 'Supplies',
        customHead: `
        <link rel="stylesheet" href="User/ProductPage.css">
        <script defer type="module" src="User/Supplies/supplies.js"></script>
        <link rel="stylesheet" href="User/home.css">
        `,
        user: user
     });
};

//Get Supplies
controller.getSupplies = async (req, res) => {
    try {
        const data = await getSupplies(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
};

module.exports = controller;