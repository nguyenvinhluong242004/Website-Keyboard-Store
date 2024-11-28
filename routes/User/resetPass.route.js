const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const resetPassController = require('../../app/controllers/User/ResetPassController');

router.post('/api', resetPassController.callAPIResetPass);
router.get('/', resetPassController.index);

module.exports = router;