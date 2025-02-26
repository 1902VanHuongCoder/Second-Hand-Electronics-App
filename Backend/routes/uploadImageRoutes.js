const express = require('express');
const { uploadImage, upload, uploadMulti } = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);

// Route to handle multiple image uploads
router.post('/uploadmultiple', upload.array('images', 10), uploadMulti);

module.exports = router;