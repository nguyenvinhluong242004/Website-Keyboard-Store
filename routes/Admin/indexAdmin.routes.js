const express = require('express');
const router = express.Router();

const loginRouter = require('./login.route');
const customerListRouter = require('./customerList.route');
const purchaseHistoryRouter = require('./purchaseHistory.route');
const dashboardRouter = require('./dashboard.route');
const overview = require('./overview.route');
const dailySales = require('./dailySales.route');
const monthlySales = require('./monthlySales.route');
const orderItem = require('./orderItem.route');
const product = require('./product.route');
const detailParticiparts = require('./detailParticipants.route');

//------------------------------------------

router.use('/dashboard', dashboardRouter);
router.use('/purchase-history', purchaseHistoryRouter);
router.use('/customer-list', customerListRouter);
router.use('/', loginRouter); // Trang login admin
router.use('/overview', overview);
router.use('/daily-sales', dailySales);
router.use('/monthly-sales', monthlySales);
router.use('/order', orderItem)
router.use('/product', product)
router.use ('/d',detailParticiparts)

module.exports = router;
