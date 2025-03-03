const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route để xác nhận thanh toán
router.post('/confirm-payment', orderController.confirmPayment);

module.exports = router;