const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.getHomeProducts);
router.get('/getAllProductByBrands/:brandId', homeController.getProductsByBrand)

module.exports = router; 