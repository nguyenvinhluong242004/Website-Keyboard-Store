const express = require('express');
const  router = express.Router();
const controller = require('../../app/controllers/User/accessoriesController');

router.get('/', controller.showAccessories);
router.get('/api/get-accessories', controller.getAccessories);

module.exports = router;