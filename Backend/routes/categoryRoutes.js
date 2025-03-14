const express = require('express');
const { addCategory, getCategories, getAllCategories } = require('../controllers/categoryController');

const router = express.Router();

// Route để thêm Category
router.post('/categories', addCategory);

// Route để lấy danh sách Category
router.get('/categories', getCategories);

// Route để lấy tất cả danh sách Category
router.get('/allcategory', getAllCategories);

module.exports = router; 