const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Route để lấy danh sách sản phẩm
router.get('/', homeController.getHomeProducts);

// Route để lấy sản phẩm theo id
router.get('/getAllProductByBrands/:brandId', homeController.getProductsByBrand)

module.exports = router; 