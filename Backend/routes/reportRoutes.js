const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// Tạo báo cáo mới - yêu cầu đăng nhập
router.post('/', protect, reportController.createReport);

// Lấy báo cáo của người dùng hiện tại - yêu cầu đăng nhập
router.get('/my-reports', protect, reportController.getUserReports);

// Lấy tất cả báo cáo - chỉ dành cho admin
router.get('/', protect, authorize('admin'), reportController.getAllReports);

// Lấy chi tiết báo cáo - chỉ dành cho admin hoặc người tạo báo cáo
router.get('/:id', protect, reportController.getReportById);

// Cập nhật trạng thái báo cáo - chỉ dành cho admin
router.patch('/:id', protect, authorize('admin'), reportController.updateReportStatus);

// Lấy báo cáo theo sản phẩm - chỉ dành cho admin
router.get('/product/:productId', protect, authorize('admin'), reportController.getReportsByProduct);

module.exports = router; 