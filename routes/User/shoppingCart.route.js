const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const shoppingCartController = require('../../app/controllers/User/shoppingCartController');

router.post('/add', shoppingCartController.add);
router.post('/change', shoppingCartController.change);
router.get('/get', shoppingCartController.get);
router.get('/', shoppingCartController.index);

module.exports = router;