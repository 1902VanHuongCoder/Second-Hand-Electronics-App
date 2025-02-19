const express = require('express');
const { addCpu, getCpus } = require('../controllers/cpuController');

const router = express.Router();

// Route để thêm CPU
router.post('/cpus', addCpu);

// Route để lấy danh sách CPU
router.get('/cpus', getCpus);

module.exports = router;