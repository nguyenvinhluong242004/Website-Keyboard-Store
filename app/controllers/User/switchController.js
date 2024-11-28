const {getSwitch} = require('../../models/User/switchModel');

const controller ={}

//Render Switch
controller.showSwitch = (req, res) => {
    res.render('ProductPage', {layout: 'layout', title: 'Switch',
        customHead: `
        <link rel="stylesheet" href="User/ProductPage.css">
        <script defer type="module" src="User/Switch/switch.js"></script>
        `
     });
};

//Get Switch
controller.getSwitch = async (req, res) => {
    try {
        const data = await getSwitch(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
};

module.exports = controller;