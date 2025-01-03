const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/User/MerchController');

router.get('/', controller.showMerch);
router.get('/api/get-merch', controller.getMerch);

module.exports = router;