const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const loginController = require('../../app/controllers/Admin/LoginController');

router.post('/api', loginController.callAPILogin);
router.get('/out', loginController.logout);
router.get('/', loginController.index);

module.exports = router;