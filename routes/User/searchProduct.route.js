const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const controller = require('../../app/controllers/User/SearchProductController');

router.get('/', controller.showSearchProduct);
router.get('/api/get-search', controller.searchProduct);

module.exports = router;