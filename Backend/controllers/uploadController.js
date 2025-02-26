const dotenv = require('dotenv');
dotenv.config();

const cloudinary = require('../cloundinaryConfig');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, 'uploads/'); // Temporary storage before uploading to Cloudinary
  // },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.upload = upload;

exports.uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pictures', // Optional: specify a folder in Cloudinary
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
};

// Function to upload multiple images to Cloudinary
exports.uploadMulti = async (req, res) => {
  try {
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'profile_pictures', // Optional: specify a folder in Cloudinary
      });
      urls.push(result.secure_url);
    }

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      urls: urls,
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ success: false, message: 'Error uploading images' });
  }
};