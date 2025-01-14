const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/User/merchController');

router.get('/', controller.showMerch);
router.get('/api/get-merch', controller.getMerch);

module.exports = router;