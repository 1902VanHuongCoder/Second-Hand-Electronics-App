const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

// Load env vars trước khi làm bất cứ điều gì khác
dotenv.config();

console.log('MONGODB_URI:', process.env.MONGODB_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware để log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route mặc định cho đường dẫn gốc
app.get('/', (req, res) => {
  console.log('Client accessed root route');
  res.json({ 
    message: 'Welcome to API Server',
    status: 'running'
  });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  console.log('Client tested connection');
  res.json({ 
    message: 'Kết nối thành công đến server!',
    timestamp: new Date().toISOString()
  });
});

// Test API với POST request
app.post('/api/hello', (req, res) => {
  const { name } = req.body;
  console.log(`Received hello request from: ${name || 'Anonymous'}`);
  res.json({ 
    message: `Xin chào, ${name || 'Người dùng'}!`,
    timestamp: new Date().toISOString()
  });
});

// Route đăng ký
app.post('/api/register', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Kiểm tra xem số điện thoại đã tồn tại chưa
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Số điện thoại đã được đăng ký' 
      });
    }

    // Tạo user mới
    const user = await User.create({
      phone,
      password // Trong thực tế nên mã hóa password
    });

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id },
      'your_jwt_secret', // Nên đặt trong biến môi trường
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        token,
        user: {
          phone: user.phone,
          id: user._id
        }
      }
    });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
});

// Route đăng nhập
app.post('/api/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Tìm user theo số điện thoại
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Số điện thoại hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Số điện thoại hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id },
      'your_jwt_secret', // Nên đặt trong biến môi trường
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          phone: user.phone,
          id: user._id
        }
      }
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Kết nối database
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại port ${PORT}`);
    });
  } catch (error) {
    console.error('Không thể khởi động server:', error);
    process.exit(1);
  }
};

// Khởi động server
startServer();

// Xử lý lỗi không mong muốn
process.on('unhandledRejection', (err) => {
  console.error('Lỗi không mong muốn:', err);
  process.exit(1);
});