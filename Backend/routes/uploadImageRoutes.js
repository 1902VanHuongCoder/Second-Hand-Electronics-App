const express = require('express');

const {uploadVideo, uploadImage, upload, uploadMulti, uploadVideoMiddleware } = require('../controllers/uploadController');

const router = express.Router();
const uploadController = require('../controllers/uploadController');
const multer = require('multer');

// Cấu hình multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });
// // Cấu hình multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// const upload = multer({ 
//     storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Chỉ chấp nhận file ảnh!'));
//         }
//     }
// });
router.post('/uploadAvatar', upload.single('image'), uploadController.uploadAvatar);
// Route upload nhiều ảnh
router.post('/uploadmultiple', upload.array('images', 6), uploadController.uploadMulti);

// Route để khởi tạo dữ liệu hash cho các ảnh đã tồn tại
router.post('/initialize-image-hashes', uploadController.initializeImageHashes);

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