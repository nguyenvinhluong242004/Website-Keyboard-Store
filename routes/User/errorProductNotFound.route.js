const express = require('express');
const router = express.Router();
const errorProductNotFoundController = require('../../app/controllers/User/errorProductNotFoundController');

router.get('/', errorProductNotFoundController.showErrorProductNotFound);

module.exports = router;