const express = require('express');
const { addGpu, getGpus } = require('../controllers/gpuController');

const router = express.Router();

// Route để thêm GPU
router.post('/gpus', addGpu);

// Route để lấy danh sách GPU
router.get('/gpus', getGpus);

module.exports = router;