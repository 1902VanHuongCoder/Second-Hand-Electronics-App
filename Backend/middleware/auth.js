const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware bảo vệ route - yêu cầu đăng nhập
exports.protect = async (req, res, next) => {
  let token;

  console.log('Headers:', req.headers);

  // Kiểm tra header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted:', token);
  }

  // Kiểm tra xem token có tồn tại không
  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập, vui lòng đăng nhập'
    });
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Decoded token:', decoded);

    // Tìm người dùng từ id trong token
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('User not found with id:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    console.log('User authenticated:', user.name);

    // Thêm thông tin người dùng vào request
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

// Middleware phân quyền
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('No user in request for authorization');
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập trước'
      });
    }

    console.log('User role:', req.user.role, 'Required roles:', roles);

    if (!roles.includes(req.user.role)) {
      console.log('User does not have required role');
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này'
      });
    }

    next();
  };
}; 