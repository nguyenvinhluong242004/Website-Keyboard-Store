const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/User/deskpadsController');

router.get('/', controller.showDeskpads);
router.get('/api/get-deskpads', controller.getDeskpads);

module.exports = router;