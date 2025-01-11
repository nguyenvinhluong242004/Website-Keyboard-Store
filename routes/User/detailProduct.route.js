const express = require('express');
const router = express.Router();
const detailProductController = require('../../app/controllers/User/detailProductController');
const apiImageController = require("../../app/controllers/User/getApiImageController");


router.get('/instock/:id', detailProductController.showDetailProductVer2);
router.get('/instock/same-product/:category', detailProductController.getSameProduct);
router.get('/groupby/same-product/:category', detailProductController.getSameProductGB);
router.get('/instock/image/api', apiImageController.createApi.bind(apiImageController));
router.get('/instock/image_detail_product/api', apiImageController.createApiForDetail.bind(apiImageController));
router.get('/instock/review/api',detailProductController.getReview);
router.post('/insert/review',  detailProductController.insertReview);
router.get('/image-product/api/:id', detailProductController.getImageProduct);

module.exports = router;