const { getTotalUsers, getTotalRevenue, getChartRevenue } = require('../../models/Admin/overviewModel');

const controller ={}

//Render Overview
controller.showOverview = (req, res) => {
    res.render('Admin/overview', {layout: 'layoutAdmin', title: 'Overview',
        customHead: `
        <link rel="stylesheet" href="/Admin/Overview/overview.css">
        <script defer type="module" src="/Admin/Overview/overview.js"></script>
        <script defer type="module" src="/Admin/ChartComponent.js"></script>
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

controller.getChartRevenue = async (req, res) => {
    try {
        const data = await getChartRevenue(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
};

module.exports = controller;