const Report = require('../models/Report');
const Product = require('../models/Product');
const User = require('../models/User');

// Tạo báo cáo mới
exports.createReport = async (req, res) => {
    try {
        const { productId, reason, description } = req.body;
        const userId = req.user.id; // Lấy từ middleware xác thực

        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Kiểm tra xem người dùng có đang báo cáo sản phẩm của chính mình không
        if (product.userId.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: 'Bạn không thể báo cáo sản phẩm của chính mình'
            });
        }

        // Kiểm tra xem người dùng đã báo cáo sản phẩm này chưa
        const existingReport = await Report.findOne({ productId, userId });
        if (existingReport) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã báo cáo sản phẩm này trước đó'
            });
        }

        // Tạo báo cáo mới
        const newReport = new Report({
            productId,
            userId,
            reason,
            description: description || ''
        });

        await newReport.save();

        res.status(201).json({
            success: true,
            message: 'Báo cáo đã được gửi thành công',
            data: newReport
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi gửi báo cáo',
            error: error.message
        });
    }
};

// Lấy tất cả báo cáo (chỉ dành cho admin)
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('productId', 'title images price')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách báo cáo',
            error: error.message
        });
    }
};

// Lấy chi tiết báo cáo
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('productId')
            .populate('userId', 'name email');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy báo cáo'
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy thông tin báo cáo',
            error: error.message
        });
    }
};

// Cập nhật trạng thái báo cáo (chỉ dành cho admin)
exports.updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'reviewed', 'resolved'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ'
            });
        }

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy báo cáo'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái báo cáo thành công',
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi cập nhật trạng thái báo cáo',
            error: error.message
        });
    }
};

// Lấy báo cáo theo sản phẩm
exports.getReportsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const reports = await Report.find({ productId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách báo cáo theo sản phẩm',
            error: error.message
        });
    }
};

// Lấy báo cáo của người dùng hiện tại
exports.getUserReports = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ middleware xác thực
        
        const reports = await Report.find({ userId })
            .populate('productId', 'title images price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách báo cáo của bạn',
            error: error.message
        });
    }
}; 