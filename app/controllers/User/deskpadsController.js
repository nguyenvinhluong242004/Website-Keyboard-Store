const {getDeskpads} = require('../../models/User/deskpadsModel');

const controller ={}

//Render Deskpads
controller.showDeskpads = (req, res) => {
    const user = req.session.user;
    res.render('User/ProductPage', {layout: 'layoutUser', title: 'Deskpads',
        customHead: `
        <link rel="stylesheet" href="User/ProductPage.css">
        <script defer type="module" src="User/Deskpads/deskpads.js"></script>
        <link rel="stylesheet" href="User/home.css">
        `,
        user: user
     });
};

//Get Deskpads
controller.getDeskpads = async (req, res) => {
    try {
        const data = await getDeskpads(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
};

module.exports = controller;