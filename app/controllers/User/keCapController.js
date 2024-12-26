const {getKeCap} = require('../../models/User/keCapModel');

const controller ={}

// Render Kecap
controller.showKeCap = (req, res) => {
    const user = req.session.user;
    res.render('User/ProductPage', {layout: 'layoutUser', title: 'KeCap',
        customHead: `
        <link rel="stylesheet" href="User/ProductPage.css">
        <script defer type="module" src="User/KeCap/keCap.js"></script>
        <link rel="stylesheet" href="User/home.css">
        `,
        user: user
    });
};

// Get Kecap
controller.getKeCap = async (req, res) => {
    try {
        const data = await getKeCap(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
};

module.exports = controller;