const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/User/suppliesController');

router.get('/', controller.showSupplies);
router.get('/api/get-supplies', controller.getSupplies);

module.exports = router;