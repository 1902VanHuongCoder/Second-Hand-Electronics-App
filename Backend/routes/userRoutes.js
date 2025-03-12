const express = require('express');
const { register, login, update, updateUser, togglePhoneVisibility } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.put('/update', updateUser);
router.put('/toggle-phone-visibility', togglePhoneVisibility);

// Thêm route để lấy thông tin người dùng từ token
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }
    
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      avatarUrl: user.avatarUrl,
      role: user.role || 'user'
    });
  } catch (error) {
    console.error('Error in /me route:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router; 