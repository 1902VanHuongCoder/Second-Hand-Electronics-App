const mongoose = require('mongoose');

const imageHashSchema = new mongoose.Schema({ // This collection is used to store the hash of the image
  imageUrl: {
    type: String,
    required: true,
    unique: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  // Thêm trường để lưu trữ các đặc trưng của ảnh
  features: {
    type: Object,
    default: {}
  },
  // Thêm trường để lưu trữ kích thước ảnh
  dimensions: {
    width: Number,
    height: Number
  },
  // Thêm trường để lưu trữ thông tin về sản phẩm liên quan
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    index: true
  },
  // Thêm trường để đánh dấu ảnh đã được xử lý bởi thuật toán nâng cao
  processedByAdvancedAlgorithm: {
    type: Boolean,
    default: false
  },
  // Thêm trường để lưu trữ vector đặc trưng (có thể dùng cho thuật toán so sánh nâng cao)
  featureVector: {
    type: [Number],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Tạo index cho hash để tăng tốc độ tìm kiếm
imageHashSchema.index({ hash: 1 });
imageHashSchema.index({ publicId: 1 });
imageHashSchema.index({ featureVector: 1 }, { sparse: true });

module.exports = mongoose.model('ImageHash', imageHashSchema); 