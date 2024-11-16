const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const confirmPassController = require('../app/controllers/ConfirmMailController');

router.post('/send-code/api', confirmPassController.sendCode);
router.get('/', confirmPassController.index);

module.exports = router;