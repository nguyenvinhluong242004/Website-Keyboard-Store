const express = require('express');
const router = express.Router();
const detailProductController = require('../../app/controllers/User/detailProductController');

router.get('/', detailProductController.showDetailProduct);

module.exports = router;