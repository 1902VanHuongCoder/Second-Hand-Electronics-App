const express = require('express');
const { addBrand, getBrands, getBrandsById } = require('../controllers/brandController');

const router = express.Router();

// Route để thêm Brand
router.post('/brands', addBrand);

// Route để lấy danh sách Brand
router.get('/brands', getBrands); 

router.get('/brands/:categoryId', getBrandsById);

module.exports = router; 