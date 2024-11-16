const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const authLoginController = require('../app/controllers/AuthLoginGGController');

router.get('/callback', authLoginController.LoginGoogleCallback);
router.get('/', authLoginController.LoginGoogle);

module.exports = router;