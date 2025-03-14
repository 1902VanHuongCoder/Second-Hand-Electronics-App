const express = require('express');
const router = express.Router();
const laptopController = require('../controllers/laptopController');

// Route để lấy danh sách sản phẩm
router.get('/', laptopController.getAllLaptops);

// Route để lấy sản phẩm theo id
router.get('/:id', laptopController.getLaptopById);

// Route để thêm Laptop
router.post('/', laptopController.createLaptop);

// Route để cập nhật Laptop
router.put('/:id', laptopController.updateLaptop);

// Route để xóa Laptop
router.delete('/:id', laptopController.deleteLaptop);

module.exports = router;
