const { uploadImage } = require('../controllers/uploadController');
const { upload } = require('../controllers/uploadController');
const express = require('express');

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;