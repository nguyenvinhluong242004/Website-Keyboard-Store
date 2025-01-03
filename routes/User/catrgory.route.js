const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/User/groupByController');

router.get('/', controller.showGroupByProduct);
router.get('/api/get-group-by-product', controller.getGroupByProduct);

module.exports = router;