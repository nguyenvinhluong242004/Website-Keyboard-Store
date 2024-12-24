const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const paymentController = require('../../app/controllers/User/paymentController');

router.get('/', paymentController.showPayment);
router.get('/api/get-address', paymentController.getAddress);
router.post('/api/place-order', paymentController.placeOrder);

module.exports = router;