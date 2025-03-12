const express = require('express');

const {uploadVideo, uploadImage, upload, uploadMulti, uploadVideoMiddleware } = require('../controllers/uploadController');

const router = express.Router();
const uploadController = require('../controllers/uploadController');
const multer = require('multer');

router.post('/uploadAvatar', upload.single('image'), uploadController.uploadAvatar);
// Route upload nhiều ảnh
router.post('/uploadmultiple', upload.array('images', 6), uploadController.uploadMulti);



// Route to handle video uploads
router.post('/uploadvideo', uploadVideoMiddleware.single('video'), uploadVideo);
router.post('/deleteImages', uploadController.deleteImages);
router.post('/deleteUnusedImages', uploadController.deleteUnusedImages);
// Thêm route mới để xóa một ảnh cụ thể
router.post('/deleteImage', uploadController.deleteImage);
// Thêm route mới để xóa video
router.post('/deleteVideo', uploadController.deleteVideo);


// Loại bỏ tất cả các route DELETE không cần thiết
module.exports = router;