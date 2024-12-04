const express = require('express');
const router = express.Router();

const loginRouter = require('./login.route');
const customerListRouter = require('./customerList.route');

//------------------------------------------

router.use('/customer-list', customerListRouter);
router.use('/', loginRouter); // Trang login admin

module.exports = router;
