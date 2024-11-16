const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const registerController = require('../app/controllers/RegisterController');

router.post('/api', registerController.callAPIRegister);
router.get('/', registerController.index);

module.exports = router;