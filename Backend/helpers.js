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
const uploadImageRoutes = require('./routes/uploadImageRoutes');
const phoneRoutes = require('./routes/phoneRoutes');
const postManagementRoutes = require('./routes/postManagementRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');
const paypal = require('paypal-rest-sdk');
const ChatRoom = require('./models/Chat');
const User = require('./models/User');
const Product = require('./models/Product');

// Exporting individual modules
module.exports = {
  express,
  dotenv,
  cors,
  connectDB,
  userRoutes,
  gpuRoutes,
  cpuRoutes,
  storageTypeRoutes,
  storageRoutes,
  ramRoutes,
  categoryRoutes,
  conditionRoutes,
  brandRoutes,
  versionRoutes,
  laptopRoutes,
  productRoutes,
  screenRoutes,
  homeRoutes,
  uploadImageRoutes,
  phoneRoutes,
  postManagementRoutes,
  orderRoutes,
  reportRoutes,
  paypal,
  ChatRoom,
  User,
  Product
};