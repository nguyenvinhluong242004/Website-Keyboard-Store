const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const accountController = require('../../app/controllers/User/AccountController');

router.post('/get-info/api', accountController.callAPIAccountGetInfo);
router.post('/change-info/api', accountController.callAPIAccountChangeInfo);
router.get('/', accountController.index);

module.exports = router;