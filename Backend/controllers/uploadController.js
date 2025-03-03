const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require('../cloundinaryConfig');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');

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

// Hàm lấy danh sách ảnh từ Cloudinary
async function getExistingImages() {
  try {
    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'profile_pictures/',
      max_results: 500,
    });
    return response.resources.map(resource => resource.secure_url);
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    return [];
  }
}

// Hàm tạo pHash
async function generatePHash(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(32, 32, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer();

    const pixels = new Uint8Array(buffer);
    const average = pixels.reduce((sum, val) => sum + val, 0) / pixels.length;

    let hash = '';
    for (let i = 0; i < pixels.length; i++) {
      hash += pixels[i] > average ? '1' : '0';
    }

    return hash;
  } catch (error) {
    console.error('Error generating pHash:', error);
    throw error;
  }
}

// Hàm tính khoảng cách Hamming
function getHammingDistance(hash1, hash2) {
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  return distance;
}

// Thêm hàm helper để xóa file
const deleteFile = (filePath) => {
  return new Promise((resolve) => {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
      resolve();
    });
  });
};

exports.uploadMulti = async (req, res) => {
  const tempFiles = []; // Mảng lưu đường dẫn các file tạm
  
  try {
    const urls = [];
    const files = req.files;
    const duplicateFiles = [];
    const seenHashes = new Set();

    // Lấy và tạo hash cho ảnh hiện có
    const existingImages = await getExistingImages();
    const existingHashes = [];

    for (const image of existingImages) {
      try {
        const response = await axios.get(image, { responseType: 'arraybuffer' });
        const tempPath = `./uploads/temp_${Date.now()}.jpg`;
        fs.writeFileSync(tempPath, response.data);
        tempFiles.push(tempPath); // Thêm vào danh sách file cần xóa
        const hash = await generatePHash(tempPath);
        existingHashes.push(hash);
      } catch (error) {
        console.error('Error generating hash for existing image:', error);
      }
    }

    for (const file of files) {
      tempFiles.push(file.path); // Thêm file upload vào danh sách cần xóa
      try {
        const newHash = await generatePHash(file.path);
        let isDuplicate = false;

        // Kiểm tra với ảnh đã có
        for (const existingHash of existingHashes) {
          const distance = getHammingDistance(newHash, existingHash);
           console.log(distance);
          if (distance < 20) {
           console.log(distance);
            isDuplicate = true;
            break;
          }
        }

        // Kiểm tra với ảnh trong cùng lần upload
        for (const seenHash of seenHashes) {
          const distance = getHammingDistance(newHash, seenHash);
          if (distance < 10) {
            isDuplicate = true;
            break;
          }
        }

        if (isDuplicate) {
          duplicateFiles.push(file.originalname);
          continue;
        }

        seenHashes.add(newHash);

        // Upload lên Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'profile_pictures',
        });
        urls.push(result.secure_url);
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }

    // Xóa tất cả file tạm
    await Promise.all(tempFiles.map(file => deleteFile(file)));

    if (duplicateFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Phát hiện ảnh trùng lặp',
        details: { 
          duplicateFiles: duplicateFiles
        }
      });
    }

    res.json({
      success: true,
      message: 'Tải ảnh lên thành công',
      urls: urls,
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    // Đảm bảo xóa file tạm ngay cả khi có lỗi
    await Promise.all(tempFiles.map(file => deleteFile(file)));
    
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi tải ảnh lên',
      error: error.message 
    });
  }
};


// Thêm cleanup định kỳ để đảm bảo
setInterval(() => {
  fs.readdir('./uploads', (err, files) => {
    if (err) return;
    files.forEach(file => {
      const filePath = `./uploads/${file}`;
      fs.unlink(filePath, err => {
        if (err) console.error('Error deleting leftover file:', err);
      });
    });
  });
}, 100000); // Chạy mỗi 30 '


// Function to upload a video to Cloudinary
exports.uploadVideo = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video', // Specify the resource type as video
      folder: 'videos', // Optional: specify a folder in Cloudinary
    });

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ success: false, message: 'Error uploading video' });
  }
};
