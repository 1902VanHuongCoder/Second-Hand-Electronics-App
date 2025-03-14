const express = require('express');
const router = express.Router();
const postManagementController = require('../controllers/postManagementController');

// Route để lấy danh sách bài viết
router.get('/user/:userId', postManagementController.getUserPosts);

module.exports = router; 