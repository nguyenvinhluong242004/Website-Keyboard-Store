const { getTotalUsers, getTotalRevenue, getTopSellingProducts } = require('../../models/Admin/dailySalesModel');

const controller ={}

//Render Overview
controller.showOverview = (req, res) => {
    res.render('Admin/dailySales', {layout: 'layoutAdmin', title: 'Daily Sales',
        customHead: `
        <link rel="stylesheet" href="/Admin/DailySales/dailySales.css">
        <script defer type="module" src="/Admin/DailySales/dailySales.js"></script>
        `
     });
};

controller.getTotalUsers = async (req, res) => {
    try {
        const data = await getTotalUsers(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
};

controller.getTotalRevenue = async (req, res) => {
    try {
        const data = await getTotalRevenue(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
};

controller.getTopSellingProducts = async (req, res) => {
    try {
        const data = await getTopSellingProducts(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
}

module.exports = controller;
