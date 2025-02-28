const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateUser } = require('../middleware/auth'); // Assuming you have auth middleware

// Create PayPal order
router.post('/create-order', authenticateUser, paymentController.createOrder);

// Capture payment after approval
router.post('/capture-payment', authenticateUser, paymentController.capturePayment);

// Get payment details
router.get('/details/:orderId', authenticateUser, paymentController.getPaymentDetails);

module.exports = router; 