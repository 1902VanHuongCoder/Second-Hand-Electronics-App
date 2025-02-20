const express = require('express');
const { addVersion, getVersions } = require('../controllers/versionController');

const router = express.Router();

// Route để thêm Version
router.post('/versions', addVersion);

// Route để lấy danh sách Version
router.get('/versions', getVersions);

module.exports = router; 