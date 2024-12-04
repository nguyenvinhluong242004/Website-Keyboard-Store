const express = require('express');
const router = express.Router();

const loginRouter = require('./login.route');
const customerListRouter = require('./customerList.route');
const overview = require('./overview.route');
const dailySales = require('./dailySales.route');
const monthlySales = require('./monthlySales.route');


//------------------------------------------

router.use('/customer-list', customerListRouter);
router.use('/', loginRouter); // Trang login admin
router.use('/overview', overview);
router.use('/daily-sales', dailySales);
router.use('/monthly-sales', monthlySales);

module.exports = router;
