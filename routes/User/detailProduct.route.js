const express = require('express');
const router = express.Router();
const detailProductController = require('../../app/controllers/User/detailProductController');
const apiImageController = require("../../app/controllers/User/getApiImageController");


router.get('/', detailProductController.showDetailProduct);
router.get('/image/api', apiImageController.createApi.bind(apiImageController));

module.exports = router;