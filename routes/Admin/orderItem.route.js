const express = require('express');
const router = express.Router();
const orderController = require('../../app/controllers/Admin/orderController');

router.get ('/',orderController.order);

module.exports= router;