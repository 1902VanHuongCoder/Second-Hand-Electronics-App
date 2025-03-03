const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Search products
router.get('/search', productController.searchProducts);

module.exports = router; 