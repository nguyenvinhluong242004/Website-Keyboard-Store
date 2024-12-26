const {getAccessories} = require('../../models/User/accessoriesModel');

const controller ={}

//Render Accessories
controller.showAccessories = (req, res) => {
    const user = req.session.user;
    res.render('User/ProductPage', {layout: 'layoutUser', title: 'Accessories',
        customHead: `
        <link rel="stylesheet" href="User/ProductPage.css">
        <script defer type="module" src="User/Accessories/accessories.js"></script>
        <link rel="stylesheet" href="User/home.css">
        `,
        user: user
     });
};

//Get Accessories
controller.getAccessories = async (req, res) => {
    try {
        const data = await getAccessories(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
};

module.exports = controller;