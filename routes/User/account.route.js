const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const accountController = require('../../app/controllers/User/AccountController');

router.post('/cancel-order/api', accountController.callAPIAccountCancelOrder);
router.post('/get-info/api', accountController.callAPIAccountGetInfo);
router.post('/delete-address/api', accountController.callAPIAccountDeleteAddress);
router.post('/add-address/api', accountController.callAPIAccountAddAddress);
router.post('/get-address/api', accountController.callAPIAccountGetAddress);
router.get('/get-orders/api', accountController.callAPIAccountGetOrders);
router.post('/change-info/api', accountController.callAPIAccountChangeInfo);
router.post('/logout', accountController.callAPIAccountLogout);
router.get('/', accountController.index);

module.exports = router;