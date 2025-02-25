const express = require('express');
const router = express.Router();
const postManagementController = require('../controllers/postManagementController');

router.get('/user/:userId', postManagementController.getUserPosts);

module.exports = router; 