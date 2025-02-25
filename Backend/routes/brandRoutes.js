const express = require('express');
const { addBrand, getBrands } = require('../controllers/brandController');

const router = express.Router();

// Route để thêm Brand
router.post('/brands', addBrand);

// Route để lấy danh sách Brand
router.get('/brands', getBrands);  

module.exports = router; 