const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require('../cloundinaryConfig');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const ImageHash = require('../models/ImageHash');
const Product = require('../models/Product');
const { Readable } = require('stream');

// Thay đổi cấu hình multer để sử dụng memory storage thay vì disk storage
const storage = multer.memoryStorage();

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
    // Lấy danh sách hash từ cơ sở dữ liệu thay vì tải lại từ Cloudinary
    const imageHashes = await ImageHash.find({}, 'hash imageUrl');
    return imageHashes.map(item => ({ hash: item.hash, url: item.imageUrl }));
  } catch (error) {
    console.error('Error fetching image hashes from database:', error);
    return [];
  }
}

// Hàm tạo pHash cải tiến - sửa để làm việc với buffer thay vì file path
async function generatePHash(buffer) {
  try {
    const processedBuffer = await sharp(buffer)
      .resize(32, 32, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer();

    const pixels = new Uint8Array(processedBuffer);
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

// Hàm tạo vector đặc trưng nâng cao cho ảnh - sửa để làm việc với buffer thay vì file path
async function generateFeatureVector(buffer) {
  try {
    // Sử dụng sharp để xử lý ảnh và trích xuất đặc trưng
    const metadata = await sharp(buffer).metadata();
    
    // Tạo buffer ảnh đã resize để xử lý nhất quán
    const processedBuffer = await sharp(buffer)
      .resize(64, 64, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer();
    
    const pixels = new Uint8Array(processedBuffer);
    
    // Tính toán vector đặc trưng dựa trên phân vùng ảnh
    // Chia ảnh thành 16 vùng (4x4) và tính giá trị trung bình của mỗi vùng
    const featureVector = [];
    const regionSize = 16; // 64/4 = 16 pixels per region
    const channels = metadata.channels || 3;
    
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        for (let c = 0; c < channels; c++) {
          let sum = 0;
          let count = 0;
          
          // Tính giá trị trung bình của từng kênh màu trong vùng
          for (let ry = 0; ry < regionSize; ry++) {
            for (let rx = 0; rx < regionSize; rx++) {
              const pixelIndex = ((y * regionSize + ry) * 64 + (x * regionSize + rx)) * channels + c;
              if (pixelIndex < pixels.length) {
                sum += pixels[pixelIndex];
                count++;
              }
            }
          }
          
          featureVector.push(count > 0 ? sum / count : 0);
        }
      }
    }
    
    // Thêm một số đặc trưng toàn cục
    // Histogram đơn giản cho mỗi kênh màu (chia thành 8 bins)
    const histograms = Array(channels * 8).fill(0);
    for (let i = 0; i < pixels.length; i++) {
      const channel = i % channels;
      const bin = Math.floor(pixels[i] / 32); // 256/8 = 32
      histograms[channel * 8 + bin]++;
    }
    
    // Chuẩn hóa histogram
    const pixelCount = pixels.length / channels;
    for (let i = 0; i < histograms.length; i++) {
      histograms[i] /= pixelCount;
      featureVector.push(histograms[i]);
    }
    
    return {
      featureVector,
      dimensions: {
        width: metadata.width,
        height: metadata.height
      },
      features: {
        format: metadata.format,
        size: metadata.size,
        channels: metadata.channels
      }
    };
  } catch (error) {
    console.error('Error generating feature vector:', error);
    throw error;
  }
}

// Hàm tính khoảng cách cosine giữa hai vector
function cosineSimilarity(vector1, vector2) {
  if (vector1.length !== vector2.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    magnitude1 += vector1[i] * vector1[i];
    magnitude2 += vector2[i] * vector2[i];
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
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

// Hàm kiểm tra ảnh trùng lặp nâng cao - sửa để làm việc với buffer thay vì file path
async function checkDuplicateImage(buffer, threshold = 0.85) {
  try {
    // Tạo hash và vector đặc trưng cho ảnh mới
    const hash = await generatePHash(buffer);
    const { featureVector, dimensions, features } = await generateFeatureVector(buffer);
    
    // Lấy danh sách hash từ cơ sở dữ liệu
    const existingImages = await ImageHash.find({}, 'hash imageUrl featureVector');
    
    // Kết quả kiểm tra
    const results = [];
    
    for (const existingImage of existingImages) {
      // Kiểm tra bằng khoảng cách Hamming trước (nhanh hơn)
      const hammingDistance = getHammingDistance(hash, existingImage.hash);
      
      // Nếu khoảng cách Hamming đủ nhỏ, tiếp tục kiểm tra bằng vector đặc trưng
      if (hammingDistance < 80) {
        let similarity = 0;
        
        // Nếu ảnh đã có vector đặc trưng, tính độ tương đồng cosine
        if (existingImage.featureVector && existingImage.featureVector.length > 0) {
          similarity = cosineSimilarity(featureVector, existingImage.featureVector);
        }
        
        results.push({
          imageUrl: existingImage.imageUrl,
          hammingDistance,
          similarity,
          isDuplicate: hammingDistance < 10 || similarity > threshold
        });
      }
    }
    
    // Sắp xếp kết quả theo độ tương đồng giảm dần
    results.sort((a, b) => {
      if (a.similarity !== b.similarity) {
        return b.similarity - a.similarity;
      }
      return a.hammingDistance - b.hammingDistance;
    });
    
    return {
      hash,
      featureVector,
      dimensions,
      features,
      duplicates: results.filter(r => r.isDuplicate),
      similarImages: results
    };
  } catch (error) {
    console.error('Error checking duplicate image:', error);
    throw error;
  }
}

exports.uploadMulti = async (req, res) => {
  try {
    const files = req.files;
    const duplicateFiles = [];
    const duplicateDetails = [];

    // Kiểm tra trùng lặp trước khi upload sử dụng thuật toán nâng cao
    for (const file of files) {
      try {
        // Sử dụng thuật toán kiểm tra ảnh trùng lặp nâng cao với buffer
        const result = await checkDuplicateImage(file.buffer);
        
        if (result.duplicates.length > 0) {
          isDuplicate = true;
          duplicateFiles.push(file.originalname);
          
          // Lưu chi tiết về ảnh trùng lặp
          duplicateDetails.push({
            fileName: file.originalname,
            duplicateWith: result.duplicates.map(d => ({
              imageUrl: d.imageUrl,
              similarity: d.similarity,
              hammingDistance: d.hammingDistance
            }))
          });
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }

    // Nếu có bất kỳ ảnh trùng lặp nào, không upload ảnh nào cả
    if (duplicateFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Phát hiện ảnh trùng lặp',
        details: { 
          isDuplicate: true,
          inappropriateFiles: duplicateFiles,
          duplicateDetails: duplicateDetails
        }
      });
    }

    // Chỉ upload khi không có ảnh nào trùng lặp
    const urls = [];
    for (const file of files) {
      try {
        // Tạo stream từ buffer để upload lên Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'profile_pictures' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          
          // Tạo stream từ buffer và pipe vào uploadStream
          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null);
          bufferStream.pipe(uploadStream);
        });
        
        urls.push(result.secure_url);
        
        // Tạo hash và vector đặc trưng cho ảnh
        const hash = await generatePHash(file.buffer);
        const { featureVector, dimensions, features } = await generateFeatureVector(file.buffer);
        const publicId = getPublicIdFromUrl(result.secure_url);
        
        // Lưu thông tin đầy đủ vào cơ sở dữ liệu
        await ImageHash.create({
          imageUrl: result.secure_url,
          publicId: publicId,
          hash: hash,
          featureVector: featureVector,
          dimensions: dimensions,
          features: features,
          processedByAdvancedAlgorithm: true
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    res.json({
      success: true,
      message: 'Tải ảnh lên thành công',
      urls: urls,
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi tải ảnh lên',
      error: error.message 
    });
  }
};

// Function to upload a video to Cloudinary - sửa để sử dụng buffer
exports.uploadVideo = async (req, res) => {
  try {
    // Tạo stream từ buffer để upload lên Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          resource_type: 'video',
          folder: 'videos'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Tạo stream từ buffer và pipe vào uploadStream
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
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

// Hàm upload avatar - sửa để sử dụng buffer
exports.uploadAvatar = async (req, res) => {
  try {
    // Tạo stream từ buffer để upload lên Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'profile_pictures' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Tạo stream từ buffer và pipe vào uploadStream
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
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
};

// Hàm lấy public_id từ secure_url của Cloudinary
const getPublicIdFromUrl = (url, resourceType = 'image') => {
  try {
    // Giải mã URL nếu nó đã được mã hóa
    const decodedUrl = decodeURIComponent(url);
    console.log(`Decoding ${resourceType} URL for publicId extraction:`, decodedUrl);
    
    // Kiểm tra xem URL có phải là URL Cloudinary không
    if (!decodedUrl.includes('cloudinary.com')) {
      console.log('Not a Cloudinary URL:', decodedUrl);
      return null;
    }
    
    // Xác định folder mặc định dựa vào loại resource
    const defaultFolder = resourceType === 'video' ? 'videos' : 'profile_pictures';
    const resourceTypeInUrl = resourceType === 'video' ? '/video/' : '/image/';
    
    // Xử lý URL có chứa folder mặc định
    if (decodedUrl.includes(defaultFolder) || decodedUrl.includes(resourceTypeInUrl)) {
      console.log(`URL contains ${defaultFolder} or ${resourceTypeInUrl}`);
      
      // Trích xuất phần sau /upload/ từ URL
      const uploadIndex = decodedUrl.indexOf('/upload/');
      if (uploadIndex !== -1) {
        const pathAfterUpload = decodedUrl.substring(uploadIndex + 8); // +8 để bỏ qua '/upload/'
        console.log('Path after /upload/:', pathAfterUpload);
        
        // Loại bỏ phần version nếu có (v1234567890/)
        const versionRegex = /^v\d+\//;
        const pathWithoutVersion = pathAfterUpload.replace(versionRegex, '');
        console.log('Path without version:', pathWithoutVersion);
        
        // Loại bỏ phần mở rộng file (.jpg, .png, .mp4, etc.)
        const extensionIndex = pathWithoutVersion.lastIndexOf('.');
        const publicIdWithoutExt = extensionIndex !== -1 
          ? pathWithoutVersion.substring(0, extensionIndex) 
          : pathWithoutVersion;
        
        // Đảm bảo publicId bắt đầu với folder mặc định nếu cần
        if (decodedUrl.includes(defaultFolder)) {
          const publicId = publicIdWithoutExt.startsWith(`${defaultFolder}/`) 
            ? publicIdWithoutExt 
            : `${defaultFolder}/${publicIdWithoutExt.split('/').pop()}`;
          
          console.log(`Extracted publicId for ${resourceType}:`, publicId);
          return publicId;
        }
        
        console.log(`Extracted publicId for ${resourceType}:`, publicIdWithoutExt);
        return publicIdWithoutExt;
      }
    }
    
    // Xử lý các định dạng URL Cloudinary khác nhau
    // Format 1: https://res.cloudinary.com/cloudname/{resource_type}/upload/v1234567890/folder/filename.ext
    // Format 2: https://res.cloudinary.com/cloudname/{resource_type}/upload/folder/filename.ext
    
    // Trích xuất phần sau /upload/ từ URL
    const uploadIndex = decodedUrl.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const pathAfterUpload = decodedUrl.substring(uploadIndex + 8); // +8 để bỏ qua '/upload/'
      console.log('Path after /upload/:', pathAfterUpload);
      
      // Loại bỏ phần version nếu có (v1234567890/)
      const versionRegex = /^v\d+\//;
      const pathWithoutVersion = pathAfterUpload.replace(versionRegex, '');
      console.log('Path without version:', pathWithoutVersion);
      
      // Loại bỏ phần mở rộng file (.jpg, .png, .mp4, etc.)
      const extensionIndex = pathWithoutVersion.lastIndexOf('.');
      const publicId = extensionIndex !== -1 
        ? pathWithoutVersion.substring(0, extensionIndex) 
        : pathWithoutVersion;
      
      console.log(`Extracted publicId for ${resourceType}:`, publicId);
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
      console.log(`Extracted publicId for ${resourceType} (alternative method):`, publicId);
      return publicId;
    }
    
    return null;
  } catch (error) {
    console.error(`Error extracting publicId from ${resourceType} URL:`, error);
    return null;
  }
};

// Hàm trích xuất publicId từ URL video - giữ lại để tương thích với code hiện tại
const getPublicIdFromVideoUrl = (url) => {
  return getPublicIdFromUrl(url, 'video');
};

// Hàm xóa ảnh trên Cloudinary
const deleteCloudinaryImage = async (imageUrl) => {
  console.log('Deleting image from Cloudinary:', imageUrl);
  
  if (!imageUrl) {
    console.error('No image URL provided');
    return { result: 'error', error: 'No image URL provided' };
  }
  
  // Trích xuất public ID từ URL
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
    
    // Xóa hash khỏi cơ sở dữ liệu
    if (result.result === 'ok') {
      try {
        // Tìm thông tin ảnh trước khi xóa
        const imageData = await ImageHash.findOne({ imageUrl: imageUrl });
        
        // Xóa bản ghi từ cơ sở dữ liệu
        await ImageHash.findOneAndDelete({ imageUrl: imageUrl });
        console.log('Deleted image hash from database for URL:', imageUrl);
        
        // Kiểm tra xem ảnh có liên kết với sản phẩm nào không
        if (imageData && imageData.productId) {
          // Cập nhật sản phẩm để xóa ảnh khỏi mảng images
          await Product.updateOne(
            { _id: imageData.productId },
            { $pull: { images: imageUrl } }
          );
          console.log('Removed image reference from product:', imageData.productId);
        }
        
        return { result: 'ok', message: 'Image deleted successfully' };
      } catch (dbError) {
        console.error('Error deleting image hash from database:', dbError);
        return { result: 'partial', message: 'Image deleted from Cloudinary but failed to update database', error: dbError.message };
      }
    } else {
      return { result: 'error', error: 'Failed to delete image from Cloudinary', cloudinaryResult: result };
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
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
    
    // Mảng các phiên bản publicId để thử
    const publicIdVariations = [
      publicId, // Thử publicId gốc trước
      publicId.split('/').pop(), // Chỉ tên file
      publicId.includes('/') ? publicId : `videos/${publicId}`, // Thêm prefix videos
      publicId.includes('videos/') ? publicId.replace('videos/', '') : publicId // Bỏ prefix videos
    ];
    
    // Thử lần lượt từng phiên bản publicId
    for (const idVariation of publicIdVariations) {
      try {
        console.log('Trying to delete video with publicId:', idVariation);
        const result = await cloudinary.uploader.destroy(idVariation, { resource_type: 'video' });
        console.log('Cloudinary delete video result:', result);
        
        if (result.result === 'ok') {
          return result;
        }
      } catch (err) {
        console.error(`Error deleting video with publicId ${idVariation}:`, err);
        // Tiếp tục với phiên bản tiếp theo
      }
    }
    
    // Nếu không có phiên bản nào thành công
    return { result: 'not found', message: 'Video could not be found or deleted' };
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
