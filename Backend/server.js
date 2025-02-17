const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

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

// Sử dụng các route người dùng
app.use('/api', userRoutes);

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