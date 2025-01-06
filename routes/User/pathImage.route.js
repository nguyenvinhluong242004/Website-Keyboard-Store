const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/User/findPathImageController');

router.get('/path_img', controller.getPathImg);
router.get('/indexLastProduct', controller.indexLastProduct);
router.get('/category', controller.allcategory);
router.get('/review/:id', controller.review);
router.post('/give-review/', controller.giveReview);

module.exports = router;