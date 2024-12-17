const express = require('express');
const router = express.Router();
const controller = require('../../app/controllers/User/subscribeNewsletterController');

router.post('/api', controller.subscribeNewsletter);

module.exports = router;
