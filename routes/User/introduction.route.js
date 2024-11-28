const express = require('express');
const router = express.Router();
const IntroductionController = require('../../app/controllers/User/introductionController');
const introductionController = new IntroductionController();

router.get('/', introductionController.index);

module.exports = router;