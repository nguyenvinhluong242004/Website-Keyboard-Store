const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const customerListController = require('../../app/controllers/Admin/CustomerListController');

router.get('/load-customers', customerListController.loadCustomers);
router.post('/detail', customerListController.customerDetails);
router.get('/', customerListController.index);

module.exports = router;