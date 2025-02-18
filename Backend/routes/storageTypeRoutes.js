const express = require('express');
const { addStorageType, getStorageTypes } = require('../controllers/storageTypeController');

const router = express.Router();

// Route để thêm StorageType
router.post('/storage-types', addStorageType);

// Route để lấy danh sách StorageType
router.get('/storage-types', getStorageTypes);

module.exports = router;
