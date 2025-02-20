const express = require('express');
const { addStorage, getStorages } = require('../controllers/storageController');

const router = express.Router();

// Route để thêm Storage
router.post('/storages', addStorage);

// Route để lấy danh sách Storage
router.get('/storages', getStorages);

module.exports = router; 