const express = require('express');
const router = express.Router();
const serviceController = require('../../app/controllers/User/serviceController');

// Route cho trang dịch vụ
router.get('/', serviceController.getServicePage);

module.exports = router;
