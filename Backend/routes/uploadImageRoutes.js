const express = require('express');
const {uploadVideo, uploadImage, upload, uploadMulti } = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);

// Route to handle multiple image uploads
router.post('/uploadmultiple', upload.array('images', 10), uploadMulti);

// Route to handle video uploads
router.post('/uploadvideo', upload.single('video'), uploadVideo);

module.exports = router;