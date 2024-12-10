const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/Admin/productController');

router.get('/', controller.productList);
router.get('/filter', controller.filterProducts);
router.get('/productAdd', controller.productAdd);
router.post('/addProduct', controller.addProduct);

module.exports = router;