const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/Admin/productController');
const upload = require('../../app/middlewares/uploadMiddleware'); // Import middleware cho multer

router.get('/', controller.productList);
router.get('/filter', controller.filterProducts);
router.get('/productAdd', controller.productAdd);
router.post('/addProduct', controller.addProduct);
router.post('/addImages', upload.single('image'), controller.addImages);
router.delete('/delete/:id', controller.deleteProduct);
router.put('/update/:productId', controller.updateProduct);

module.exports = router;