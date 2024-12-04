const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/Admin/overviewController');

router.get('/', controller.showOverview);
router.get('/api/total-users', controller.getTotalUsers);
router.get('/api/total-revenue', controller.getTotalRevenue);
router.get('/api/chart-revenue', controller.getChartRevenue);
module.exports = router;