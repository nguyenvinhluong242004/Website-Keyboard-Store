const express = require('express'); // Web framework cho Node.js
const router = express.Router();
const purchaseHistoryController = require('../../app/controllers/Admin/PurchaseHistoryController');

router.post('/change-status', purchaseHistoryController.changeStatus);
router.get('/load-orders', purchaseHistoryController.loadOrders);
router.post('/detail', purchaseHistoryController.orderDetails);
router.get('/', purchaseHistoryController.index);

module.exports = router;