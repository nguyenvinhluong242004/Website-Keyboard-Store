const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/User/findPathImageController');

router.get('/path_img', controller.getPathImg);
router.get('/indexLastProduct', controller.indexLastProduct);
router.get('/category', controller.allcategory);

module.exports = router;