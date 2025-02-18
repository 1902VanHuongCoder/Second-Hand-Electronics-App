const express = require('express');
const { addRam, getRams } = require('../controllers/ramController');

const router = express.Router();

// Route để thêm RAM
router.post('/rams', addRam);

// Route để lấy danh sách RAM
router.get('/rams', getRams);

module.exports = router; 