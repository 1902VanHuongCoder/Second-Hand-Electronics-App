const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Route đăng ký
exports.register = async (req, res) => {
  try {
    const { phone, password, name, email, address } = req.body;
    
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Số điện thoại đã được đăng ký' 
      });
    }

    const user = await User.create({ phone, password, name, email, address });

    res.status(201).json({
      type: 'auth/signupUser/fulfilled',
      success: true,
      message: 'Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.',
        user: {
          phone: user.phone,
          id: user._id,
          name: user.name,
          email: user.email,
          address: user.address
        }
    });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};

// Route đăng nhập
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Số điện thoại hoặc mật khẩu không đúng'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Số điện thoại hoặc mật khẩu không đúng'
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET, // Nên đặt trong biến môi trường
      { expiresIn: '30d' }
    );

    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('User ID:', user._id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        phone: user.phone,
        id: user._id,
        name: user.name, 
        email: user.email,
        address: user.address,
        avatarUrl: user.avatarUrl 
      }
      
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Route cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { id, name, email, phone, address, avatarUrl } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.avatarUrl = avatarUrl || user.avatarUrl;

    await user.save();

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: {
        phone: user.phone,
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Lỗi cập nhật thông tin:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}; 