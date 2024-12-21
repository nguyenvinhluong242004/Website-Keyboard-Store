const express = require('express');
const router = express.Router();
const detailGroupbyController = require('../../app/controllers/User/detailGroupbyController');

router.get('/:id', detailGroupbyController.showDetailGroupby);

module.exports = router;