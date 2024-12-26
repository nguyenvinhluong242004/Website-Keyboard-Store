const {getKitPhim} = require('../../models/User/kitPhimModel');

const controller ={}

// Render Kit Phim
controller.showKitPhim = (req, res) => {
    const user = req.session.user;
    res.render('User/ProductPage', {layout: 'layoutUser', title: 'Kit Phim',
        customHead: `
        <link rel="stylesheet" href="User/ProductPage.css">
        <script defer type="module" src="User/KitPhim/kitPhim.js"></script>
        <link rel="stylesheet" href="User/home.css">
        `,
        user: user
     });
};

// Get Kit Phim
controller.getKitPhim = async (req, res) => {
    try {
        const data = await getKitPhim(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
};

module.exports = controller;