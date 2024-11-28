const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/User/switchController');

router.get('/', controller.showSwitch);
router.get('/api/get-switch', controller.getSwitch);

module.exports = router;