const express = require('express');

const {uploadVideo, uploadImage, upload, uploadMulti } = require('../controllers/uploadController');

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

// Route upload nhiều ảnh
router.post('/uploadmultiple', upload.array('images', 6), uploadController.uploadMulti);

// Route to handle video uploads
router.post('/uploadvideo', upload.single('video'), uploadVideo);

module.exports = router;