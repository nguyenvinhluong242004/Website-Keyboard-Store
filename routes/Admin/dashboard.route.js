const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const dashboardController = require('../../app/controllers/Admin/DashboardController');

router.get('/', dashboardController.index);

module.exports = router;