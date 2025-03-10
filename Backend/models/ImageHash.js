const mongoose = require('mongoose');

const imageHashSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Tạo index cho hash để tăng tốc độ tìm kiếm
imageHashSchema.index({ hash: 1 });
imageHashSchema.index({ publicId: 1 });

module.exports = mongoose.model('ImageHash', imageHashSchema); 