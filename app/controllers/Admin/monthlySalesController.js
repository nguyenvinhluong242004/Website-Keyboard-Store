const { getTotalUsers, getTotalRevenue, getTopSellingProducts } = require('../../models/Admin/monthlySalesModel');

const controller ={}

//Render Overview
controller.showOverview = (req, res) => {
    res.render('Admin/monthlySales', {layout: 'layoutAdmin', title: 'Monthly Sales',
        customHead: `
        <link rel="stylesheet" href="/Admin/MonthlySales/monthlySales.css">
        <script defer type="module" src="/Admin/MonthlySales/monthlySales.js"></script>
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
