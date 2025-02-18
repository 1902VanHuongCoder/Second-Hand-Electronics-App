const express = require('express');
const { addCategory, getCategories } = require('../controllers/categoryController');

const router = express.Router();

// Route để thêm Category
router.post('/categories', addCategory);

// Route để lấy danh sách Category
router.get('/categories', getCategories);

module.exports = router; 