const express = require('express');
const router = express.Router();
const detailProductController = require('../../app/controllers/User/detailProductController');
const apiImageController = require("../../app/controllers/User/getApiImageController");


router.get('/instock/:id', detailProductController.showDetailProductVer2);
router.get('/instock/image/api', apiImageController.createApi.bind(apiImageController));
router.get('/instock/image_detail_product/api', apiImageController.createApiForDetail.bind(apiImageController));
router.get('/instock/review/api',detailProductController.getReview);
router.post('/insert/review',  detailProductController.insertReview);

module.exports = router;