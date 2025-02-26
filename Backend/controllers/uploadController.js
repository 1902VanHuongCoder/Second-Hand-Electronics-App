const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require('../cloundinaryConfig');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const crypto = require('crypto');

// Cấu hình multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

exports.upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'));
    }
  }
});

// Hàm kiểm tra nội dung không phù hợp sử dụng Imagga
async function checkInappropriateContent(imagePath) {
  try {
    const formData = new FormData();
    
    // Đọc file và thêm vào form data với key là 'image'
    const imageFile = fs.createReadStream(imagePath);
    formData.append('image', imageFile);
    
    const baseUrl = 'https://api.imagga.com/v2';
    const response = await axios({
      method: 'post',
      url: `${baseUrl}/tags`,  // Sử dụng endpoint /tags để phân tích ảnh
      data: formData,
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.IMAGGA_API_KEY}:${process.env.IMAGGA_API_SECRET}`).toString('base64')}`,
        ...formData.getHeaders(),
        'Accept': 'application/json'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    // Kiểm tra kết quả phân tích
    if (response.data && response.data.result) {
      const tags = response.data.result.tags;
      // Danh sách các tag không phù hợp
      const inappropriateTags = ['nude', 'adult', 'nsfw', 'explicit'];
      
      // Kiểm tra xem có tag không phù hợp nào với confidence > 30%
      return tags.some(tag => 
        inappropriateTags.includes(tag.tag.en.toLowerCase()) && 
        tag.confidence > 80
      );
    }
    
    return false;
  } catch (error) {
    console.error('Error checking content:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    // Trong trường hợp lỗi, cho phép upload
    return false;
  }
}

async function generateImageHash(imagePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(imagePath);
    
    stream.on('data', (data) => {
      hash.update(data);
    });
    
    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });
    
    stream.on('error', (err) => {
      reject(err);
    });
  });
}

// Hàm lấy danh sách ảnh từ Cloudinary
async function getExistingImages() {
  try {
    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'profile_pictures/',
      max_results: 500,
    });
    // Trả về mảng URL của ảnh
    return response.resources.map(resource => resource.secure_url);
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    return [];
  }
}

exports.uploadMulti = async (req, res) => {
  try {
    const urls = [];
    const files = req.files;
    let hasInappropriateContent = false;
    const inappropriateFiles = [];
    const seenHashes = new Set(); // Set để lưu hash của các ảnh đã upload

    // Lấy danh sách hash của ảnh đã có từ Cloudinary
    const existingImages = await getExistingImages();
    const existingHashes = new Set(); // Set để lưu hash của ảnh đã tồn tại

    // Tạo hash cho tất cả ảnh hiện có
    for (const image of existingImages) {
      try {
        const response = await axios.get(image, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const hash = crypto.createHash('md5').update(buffer).digest('hex');
        existingHashes.add(hash);
      } catch (error) {
        console.error('Error generating hash for existing image:', error);
      }
    }

    for (const file of files) {
      try {
        // Kiểm tra nội dung không phù hợp
        const isInappropriate = await checkInappropriateContent(file.path);

        if (isInappropriate) {
          hasInappropriateContent = true;
          inappropriateFiles.push(file.originalname);
          continue;
        }

        // Tạo hash cho ảnh mới
        const hash = await generateImageHash(file.path);
        
        // Kiểm tra ảnh trùng lặp với ảnh đã có và ảnh trong cùng lần upload
        if (existingHashes.has(hash) || seenHashes.has(hash)) {
          inappropriateFiles.push(file.originalname);
          hasInappropriateContent = true;
          continue;
        }

        // Thêm hash vào set
        seenHashes.add(hash);

        // Upload lên Cloudinary nếu ảnh phù hợp
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'profile_pictures',
        });
        urls.push(result.secure_url);
      } finally {
        // Xóa file tạm sau khi xử lý xong
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      }
    }

    if (hasInappropriateContent) {
      return res.status(400).json({
        success: false,
        message: 'Một số ảnh có nội dung không phù hợp hoặc trùng lặp',
        details: { 
          hasInappropriateContent: true,
          inappropriateFiles: inappropriateFiles,
          isDuplicate: true
        }
      });
    }

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      urls: urls,
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading images',
      error: error.message 
    });
  }
};