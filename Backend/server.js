const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const gpuRoutes = require('./routes/gpuRoutes'); 
const cpuRoutes = require('./routes/cpuRoutes'); 
const storageTypeRoutes = require('./routes/storageTypeRoutes'); 
const storageRoutes = require('./routes/storageRoutes'); 
const ramRoutes = require('./routes/ramRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes'); 
const conditionRoutes = require('./routes/conditionRoutes'); 
const brandRoutes = require('./routes/brandRoutes'); 
const versionRoutes = require('./routes/versionRoutes'); 
const laptopRoutes = require('./routes/laptopRoutes');
const productRoutes = require('./routes/productRoutes');
const screenRoutes = require('./routes/screenRoutes');
const homeRoutes = require('./routes/homeRoutes');
const phoneRoutes = require('./routes/phoneRoutes');
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

app.use('/api', gpuRoutes );

app.use('/api', cpuRoutes);

app.use('/api', storageTypeRoutes);

// Sử dụng các route Storage
app.use('/api', storageRoutes);

// Sử dụng các route RAM
app.use('/api', ramRoutes);

// Sử dụng các route Category
app.use('/api', categoryRoutes);

// Sử dụng các route Condition
app.use('/api', conditionRoutes);

// Sử dụng các route Brand
app.use('/api', brandRoutes);

// Sử dụng các route Version
app.use('/api', versionRoutes);

// Sử dụng các route Laptop
app.use('/api/laptops', laptopRoutes);

// Sử dụng các route Product
app.use('/api/products', productRoutes);

// Sử dụng các route Screen
app.use('/api/screens', screenRoutes);

// Sử dụng các route Home
app.use('/api/home', homeRoutes);

app.use('/api/phones', phoneRoutes);

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