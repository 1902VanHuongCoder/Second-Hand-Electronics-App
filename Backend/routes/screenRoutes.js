const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screenController');

// Route để lấy danh sách Screen
router.get('/', screenController.getAllScreens);

// Route để lấy Screen theo id
router.get('/:id', screenController.getScreenById);

// Route để thêm Screen
router.post('/', screenController.createScreen);

// Route để cập nhật Screen
router.put('/:id', screenController.updateScreen);

// Route để xóa Screen
router.delete('/:id', screenController.deleteScreen);

module.exports = router; 