const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Kiểm tra các biến môi trường
console.log('Cloudinary Configuration:');
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Missing');
console.log('API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Configured' : 'Missing');
console.log('API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Configured' : 'Missing');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;