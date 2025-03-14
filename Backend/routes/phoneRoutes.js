const express = require('express');
const router = express.Router();
const phoneController = require('../controllers/phoneController');

// Route để lấy danh sách sản phẩm
router.get('/', phoneController.getAllPhones);

// Route để lấy sản phẩm theo id
router.get('/:id', phoneController.getPhoneById);

// Route để thêm Phone
router.post('/', phoneController.createPhone);

// Route để cập nhật Phone
router.put('/:id', phoneController.updatePhone);

// Route để xóa Phone
router.delete('/:id', phoneController.deletePhone);

module.exports = router; 