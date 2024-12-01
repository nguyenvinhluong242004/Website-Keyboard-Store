const express = require('express');
const router = express.Router();
const controller = require('../../app/controllers/User/keCapController');

router.get('/', controller.showKeCap);
router.get('/api/get-ke-cap', controller.getKeCap);

module.exports = router;