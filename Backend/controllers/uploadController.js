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

// Cấu hình multer cho video
exports.uploadVideoMiddleware = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB cho video
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file video!'));
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

    // Kiểm tra trùng lặp trước khi upload
    for (const file of files) {
      tempFiles.push(file.path);
      try {
        const newHash = await generatePHash(file.path);
        let isDuplicate = false;

        // Kiểm tra với ảnh đã có
        for (const existingHash of existingHashes) {
          const distance = getHammingDistance(newHash, existingHash);
          if (distance < 20) {
            isDuplicate = true;
            duplicateFiles.push(file.originalname);
            break;
          }
        }

        // Kiểm tra với ảnh trong cùng lần upload
        if (!isDuplicate) {
          for (const seenHash of seenHashes) {
            const distance = getHammingDistance(newHash, seenHash);
            if (distance < 10) {
              isDuplicate = true;
              duplicateFiles.push(file.originalname);
              break;
            }
          }
        }

        if (!isDuplicate) {
          seenHashes.add(newHash);
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }

    // Nếu có bất kỳ ảnh trùng lặp nào, không upload ảnh nào cả
    if (duplicateFiles.length > 0) {
      // Xóa tất cả file tạm
      await Promise.all(tempFiles.map(file => deleteFile(file)));
      
      return res.status(400).json({
        success: false,
        message: 'Phát hiện ảnh trùng lặp',
        details: { 
          isDuplicate: true,
          inappropriateFiles: duplicateFiles
        }
      });
    }

    // Chỉ upload khi không có ảnh nào trùng lặp
    const urls = [];
    for (const file of files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'profile_pictures',
        });
        urls.push(result.secure_url);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    // Xóa tất cả file tạm
    await Promise.all(tempFiles.map(file => deleteFile(file)));

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

// Hàm upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pictures', // Optional: specify a folder in Cloudinary
    });

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ success: false, message: 'Error uploading avatar' });
  }
// End of Selection
};

// Hàm lấy public_id từ secure_url của Cloudinary
const getPublicIdFromUrl = (url) => {
  try {
    // Giải mã URL nếu nó đã được mã hóa
    const decodedUrl = decodeURIComponent(url);
    console.log('Decoding URL for publicId extraction:', decodedUrl);
    
    // Kiểm tra xem URL có phải là URL Cloudinary không
    if (!decodedUrl.includes('cloudinary.com')) {
      console.log('Not a Cloudinary URL:', decodedUrl);
      return null;
    }
    
    // Xử lý URL có chứa profile_pictures
    if (decodedUrl.includes('profile_pictures')) {
      console.log('URL contains profile_pictures');
      
      // Trích xuất phần sau /upload/ từ URL
      const uploadIndex = decodedUrl.indexOf('/upload/');
      if (uploadIndex !== -1) {
        const pathAfterUpload = decodedUrl.substring(uploadIndex + 8); // +8 để bỏ qua '/upload/'
        console.log('Path after /upload/:', pathAfterUpload);
        
        // Loại bỏ phần version nếu có (v1234567890/)
        const versionRegex = /^v\d+\//;
        const pathWithoutVersion = pathAfterUpload.replace(versionRegex, '');
        console.log('Path without version:', pathWithoutVersion);
        
        // Loại bỏ phần mở rộng file (.jpg, .png, etc.)
        const extensionIndex = pathWithoutVersion.lastIndexOf('.');
        const publicIdWithoutExt = extensionIndex !== -1 
          ? pathWithoutVersion.substring(0, extensionIndex) 
          : pathWithoutVersion;
        
        // Đảm bảo publicId bắt đầu với 'profile_pictures/'
        const publicId = publicIdWithoutExt.startsWith('profile_pictures/') 
          ? publicIdWithoutExt 
          : `profile_pictures/${publicIdWithoutExt.split('/').pop()}`;
        
        console.log('Extracted publicId for profile picture:', publicId);
        return publicId;
      }
    }
    
    // Xử lý các định dạng URL Cloudinary khác nhau
    // Format 1: https://res.cloudinary.com/cloudname/image/upload/v1234567890/folder/filename.jpg
    // Format 2: https://res.cloudinary.com/cloudname/image/upload/folder/filename.jpg
    
    // Trích xuất phần sau /upload/ từ URL
    const uploadIndex = decodedUrl.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const pathAfterUpload = decodedUrl.substring(uploadIndex + 8); // +8 để bỏ qua '/upload/'
      console.log('Path after /upload/:', pathAfterUpload);
      
      // Loại bỏ phần version nếu có (v1234567890/)
      const versionRegex = /^v\d+\//;
      const pathWithoutVersion = pathAfterUpload.replace(versionRegex, '');
      console.log('Path without version:', pathWithoutVersion);
      
      // Loại bỏ phần mở rộng file (.jpg, .png, etc.)
      const extensionIndex = pathWithoutVersion.lastIndexOf('.');
      const publicId = extensionIndex !== -1 
        ? pathWithoutVersion.substring(0, extensionIndex) 
        : pathWithoutVersion;
      
      console.log('Extracted publicId:', publicId);
      return publicId;
    }
    
    // Thử phương pháp khác nếu không tìm thấy /upload/
    // Một số URL có thể có định dạng khác
    const parts = decodedUrl.split('/');
    const filename = parts[parts.length - 1];
    const filenameWithoutExt = filename.split('.')[0];
    
    // Kiểm tra xem có phải là URL Cloudinary không
    if (decodedUrl.includes('cloudinary.com')) {
      // Tìm folder từ URL
      const folderMatch = decodedUrl.match(/\/([^\/]+)\/[^\/]+$/);
      const folder = folderMatch ? folderMatch[1] : '';
      
      const publicId = folder ? `${folder}/${filenameWithoutExt}` : filenameWithoutExt;
      console.log('Extracted publicId (alternative method):', publicId);
      return publicId;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting publicId from URL:', error);
    return null;
  }
};

// Hàm trích xuất publicId từ URL video
const getPublicIdFromVideoUrl = (url) => {
  try {
    // Giải mã URL nếu nó đã được mã hóa
    const decodedUrl = decodeURIComponent(url);
    console.log('Decoding video URL for publicId extraction:', decodedUrl);
    
    // Kiểm tra xem URL có phải là URL Cloudinary không
    if (!decodedUrl.includes('cloudinary.com')) {
      console.log('Not a Cloudinary URL:', decodedUrl);
      return null;
    }
    
    // Xử lý URL video
    // Format: https://res.cloudinary.com/cloudname/video/upload/v1234567890/videos/filename.mp4
    
    // Trích xuất phần sau /upload/ từ URL
    const uploadIndex = decodedUrl.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const pathAfterUpload = decodedUrl.substring(uploadIndex + 8); // +8 để bỏ qua '/upload/'
      console.log('Path after /upload/ (video):', pathAfterUpload);
      
      // Loại bỏ phần version nếu có (v1234567890/)
      const versionRegex = /^v\d+\//;
      const pathWithoutVersion = pathAfterUpload.replace(versionRegex, '');
      console.log('Path without version (video):', pathWithoutVersion);
      
      // Loại bỏ phần mở rộng file (.mp4, etc.)
      const extensionIndex = pathWithoutVersion.lastIndexOf('.');
      const publicIdWithoutExt = extensionIndex !== -1 
        ? pathWithoutVersion.substring(0, extensionIndex) 
        : pathWithoutVersion;
      
      console.log('Extracted publicId for video:', publicIdWithoutExt);
      return publicIdWithoutExt;
    }
    
    // Thử phương pháp khác nếu không tìm thấy /upload/
    const parts = decodedUrl.split('/');
    const filename = parts[parts.length - 1];
    const filenameWithoutExt = filename.split('.')[0];
    
    // Kiểm tra xem có phải là URL Cloudinary không và có chứa /video/ không
    if (decodedUrl.includes('cloudinary.com') && decodedUrl.includes('/video/')) {
      // Tìm folder từ URL
      const folderMatch = decodedUrl.match(/\/([^\/]+)\/[^\/]+$/);
      const folder = folderMatch ? folderMatch[1] : '';
      
      const publicId = folder ? `${folder}/${filenameWithoutExt}` : filenameWithoutExt;
      console.log('Extracted video publicId (alternative method):', publicId);
      return publicId;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting publicId from video URL:', error);
    return null;
  }
};

// Hàm xóa ảnh trên Cloudinary
const deleteCloudinaryImage = async (imageUrl) => {
  try {
    console.log('Attempting to delete image from Cloudinary:', imageUrl);
    
    const publicId = getPublicIdFromUrl(imageUrl);
    console.log('Public ID extracted:', publicId);
    
    if (!publicId) {
      console.error('Could not extract public ID from URL:', imageUrl);
      return { result: 'error', error: 'Invalid public ID' };
    }
    
    try {
      console.log('Calling cloudinary.uploader.destroy with publicId:', publicId);
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Cloudinary delete result:', result);
      
      if (result.result === 'not found') {
        // Thử lại với một số biến thể của publicId
        console.log('Resource not found, trying alternative public ID formats...');
        
        // Thử với tên file không có đường dẫn
        const filename = publicId.split('/').pop();
        console.log('Trying with filename only:', filename);
        const result2 = await cloudinary.uploader.destroy(filename);
        console.log('Second attempt result (filename only):', result2);
        
        if (result2.result === 'ok') {
          return result2;
        }
        
        // Thử với đường dẫn đầy đủ không có prefix
        console.log('Trying with profile_pictures prefix...');
        const fullPath = publicId.includes('/') ? publicId : `profile_pictures/${publicId}`;
        const result3 = await cloudinary.uploader.destroy(fullPath);
        console.log('Third attempt result (with profile_pictures prefix):', result3);
        
        if (result3.result === 'ok') {
          return result3;
        }
        
        // Thử với đường dẫn không có profile_pictures
        if (publicId.includes('profile_pictures/')) {
          console.log('Trying without profile_pictures prefix...');
          const withoutPrefix = publicId.replace('profile_pictures/', '');
          const result4 = await cloudinary.uploader.destroy(withoutPrefix);
          console.log('Fourth attempt result (without profile_pictures prefix):', result4);
          
          if (result4.result === 'ok') {
            return result4;
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      return { result: 'error', error: error.message };
    }
  } catch (error) {
    console.error('Error in deleteCloudinaryImage:', error);
    return { result: 'error', error: error.message };
  }
};

// Hàm xóa video trên Cloudinary
const deleteCloudinaryVideo = async (videoUrl) => {
  try {
    console.log('Attempting to delete video from Cloudinary:', videoUrl);
    
    const publicId = getPublicIdFromVideoUrl(videoUrl);
    console.log('Video Public ID extracted:', publicId);
    
    if (!publicId) {
      console.error('Could not extract public ID from video URL:', videoUrl);
      return { result: 'error', error: 'Invalid video public ID' };
    }
    
    try {
      console.log('Calling cloudinary.uploader.destroy with video publicId:', publicId);
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      console.log('Cloudinary delete video result:', result);
      
      if (result.result === 'not found') {
        // Thử lại với một số biến thể của publicId
        console.log('Video resource not found, trying alternative public ID formats...');
        
        // Thử với tên file không có đường dẫn
        const filename = publicId.split('/').pop();
        console.log('Trying with video filename only:', filename);
        const result2 = await cloudinary.uploader.destroy(filename, { resource_type: 'video' });
        console.log('Second attempt result for video (filename only):', result2);
        
        if (result2.result === 'ok') {
          return result2;
        }
        
        // Thử với đường dẫn đầy đủ với prefix videos
        console.log('Trying with videos prefix...');
        const fullPath = publicId.includes('/') ? publicId : `videos/${publicId}`;
        const result3 = await cloudinary.uploader.destroy(fullPath, { resource_type: 'video' });
        console.log('Third attempt result for video (with videos prefix):', result3);
        
        if (result3.result === 'ok') {
          return result3;
        }
        
        // Thử với đường dẫn không có videos prefix
        if (publicId.includes('videos/')) {
          console.log('Trying without videos prefix...');
          const withoutPrefix = publicId.replace('videos/', '');
          const result4 = await cloudinary.uploader.destroy(withoutPrefix, { resource_type: 'video' });
          console.log('Fourth attempt result for video (without videos prefix):', result4);
          
          if (result4.result === 'ok') {
            return result4;
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting video from Cloudinary:', error);
      return { result: 'error', error: error.message };
    }
  } catch (error) {
    console.error('Error in deleteCloudinaryVideo:', error);
    return { result: 'error', error: error.message };
  }
};

// Hàm xóa nhiều ảnh trên Cloudinary
exports.deleteImages = async (req, res) => {
  try {
    const { imageUrls } = req.body;
    
    if (!Array.isArray(imageUrls)) {
      return res.status(400).json({
        success: false,
        message: 'imageUrls phải là một mảng các URL'
      });
    }

    const deleteResults = await Promise.all(
      imageUrls.map(url => deleteCloudinaryImage(url))
    );

    res.json({
      success: true,
      message: 'Đã xóa các ảnh thành công',
      results: deleteResults
    });
  } catch (error) {
    console.error('Lỗi khi xóa ảnh:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ảnh',
      error: error.message
    });
  }
};

// Hàm xóa các ảnh cũ khi cập nhật tin
exports.deleteUnusedImages = async (req, res) => {
  try {
    const { oldImageUrls, newImageUrls } = req.body;
    
    if (!Array.isArray(oldImageUrls) || !Array.isArray(newImageUrls)) {
      return res.status(400).json({
        success: false,
        message: 'oldImageUrls và newImageUrls phải là mảng các URL'
      });
    }

    // Tìm các ảnh cũ không còn trong danh sách mới
    const unusedImages = oldImageUrls.filter(url => !newImageUrls.includes(url));

    // Xóa các ảnh không còn sử dụng
    const deleteResults = await Promise.all(
      unusedImages.map(url => deleteCloudinaryImage(url))
    );

    res.json({
      success: true,
      message: 'Đã xóa các ảnh không sử dụng',
      deletedImages: unusedImages,
      results: deleteResults
    });
  } catch (error) {
    console.error('Lỗi khi xóa ảnh không sử dụng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ảnh không sử dụng',
      error: error.message
    });
  }
};

// Hàm xóa một ảnh cụ thể từ Cloudinary
exports.deleteImage = async (req, res) => {
  try {
    console.log('Delete image request received:', req.body);
    const { imageUrl } = req.body;
    
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.error('Invalid image URL:', imageUrl);
      return res.status(400).json({
        success: false,
        message: 'URL ảnh không hợp lệ'
      });
    }

    console.log('Attempting to delete image:', imageUrl);
    
    // Kiểm tra xem URL có phải là URL Cloudinary không
    if (!imageUrl.includes('cloudinary.com')) {
      console.error('Not a Cloudinary URL:', imageUrl);
      return res.status(400).json({
        success: false,
        message: 'URL không phải là URL Cloudinary'
      });
    }
    
    const result = await deleteCloudinaryImage(imageUrl);
    console.log('Delete result:', result);
    
    // Xử lý các trường hợp kết quả khác nhau
    if (result) {
      if (result.result === 'ok') {
        console.log('Image deleted successfully');
        return res.json({
          success: true,
          message: 'Đã xóa ảnh thành công',
          result: result
        });
      } 
      
      if (result.result === 'not found') {
        console.log('Image not found on Cloudinary, but considering it as deleted');
        return res.json({
          success: true,
          message: 'Ảnh không tồn tại trên Cloudinary',
          result: result
        });
      }
      
      // Trường hợp lỗi khác
      console.error('Failed to delete image:', result);
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa ảnh',
        result: result
      });
    } else {
      console.error('No result returned from deleteCloudinaryImage');
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa ảnh: Không có kết quả từ Cloudinary'
      });
    }
  } catch (error) {
    console.error('Error in deleteImage controller:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ảnh',
      error: error.message
    });
  }
};

// Hàm xóa ảnh với body thay vì params
exports.deleteImageWithBody = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    console.log('Received URL to delete (from body):', imageUrl);
    
    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'URL ảnh không hợp lệ'
      });
    }

    // Xử lý URL nếu cần
    let processedUrl = imageUrl;
    // Nếu URL không bắt đầu bằng http hoặc https, thêm vào
    if (!processedUrl.startsWith('http')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    console.log('Processed URL:', processedUrl);
    
    // Gọi hàm xóa ảnh
    const result = await deleteCloudinaryImage(processedUrl);
    console.log('Delete result:', result);
    
    if (result && result.result === 'ok') {
      res.json({
        success: true,
        message: 'Đã xóa ảnh thành công',
        result: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Không thể xóa ảnh',
        result: result
      });
    }
  } catch (error) {
    console.error('Lỗi khi xóa ảnh:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ảnh',
      error: error.message
    });
  }
};

// Hàm xóa video từ Cloudinary
exports.deleteVideo = async (req, res) => {
  try {
    console.log('Delete video request received:', req.body);
    const { videoUrl } = req.body;
    
    if (!videoUrl || typeof videoUrl !== 'string') {
      console.error('Invalid video URL:', videoUrl);
      return res.status(400).json({
        success: false,
        message: 'URL video không hợp lệ'
      });
    }

    console.log('Attempting to delete video:', videoUrl);
    
    // Kiểm tra xem URL có phải là URL Cloudinary không
    if (!videoUrl.includes('cloudinary.com')) {
      console.error('Not a Cloudinary URL:', videoUrl);
      return res.status(400).json({
        success: false,
        message: 'URL không phải là URL Cloudinary'
      });
    }
    
    // Xử lý URL nếu cần
    let processedUrl = videoUrl;
    // Nếu URL không bắt đầu bằng http hoặc https, thêm vào
    if (!processedUrl.startsWith('http')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    console.log('Processed video URL:', processedUrl);
    
    const result = await deleteCloudinaryVideo(processedUrl);
    console.log('Delete video result:', result);
    
    // Xử lý các trường hợp kết quả khác nhau
    if (result) {
      if (result.result === 'ok') {
        console.log('Video deleted successfully');
        return res.json({
          success: true,
          message: 'Đã xóa video thành công',
          result: result
        });
      } 
      
      if (result.result === 'not found') {
        console.log('Video not found on Cloudinary, but considering it as deleted');
        return res.json({
          success: true,
          message: 'Video không tồn tại trên Cloudinary',
          result: result
        });
      }
      
      // Trường hợp lỗi khác
      console.error('Failed to delete video:', result);
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa video',
        result: result
      });
    } else {
      console.error('No result returned from deleteCloudinaryVideo');
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa video: Không có kết quả từ Cloudinary'
      });
    }
  } catch (error) {
    console.error('Error in deleteVideo controller:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa video',
      error: error.message
    });
  }
};