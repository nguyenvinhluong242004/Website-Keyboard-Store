const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/User/kitPhimController');

router.get('/', controller.showKitPhim);
router.get('/api/get-kit-phim', controller.getKitPhim);

module.exports = router;