const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// router.get('/', orderController);
// router.get('/:id', orderController);
router.post('/thanhtoan', orderController.createOrder);

module.exports = router; 