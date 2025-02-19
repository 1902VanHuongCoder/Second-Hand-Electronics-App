const express = require('express');
const { addCondition, getConditions } = require('../controllers/conditionController');

const router = express.Router();

// Route để thêm Condition
router.post('/conditions', addCondition);

// Route để lấy danh sách Condition
router.get('/conditions', getConditions);

module.exports = router; 