const express = require('express');
const router = express.Router();
const orderController = require('../../app/controllers/Admin/orderController');

router.get ('/',orderController.order);
router.post ('/insert',orderController.createGroupBy);
router.post ('/insert-groupbyproduct',orderController.createGroupByProduct);
router.get ('/type',orderController.getType);
router.get ('/brand',orderController.getBrand);

module.exports= router;