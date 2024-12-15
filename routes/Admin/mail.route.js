const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const mailController = require('../../app/controllers/Admin/mailController');

router.get('/', mailController.sendMail);
router.post('/send-mail', mailController.handleSendMail);

module.exports = router;