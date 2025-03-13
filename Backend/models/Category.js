const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // Tên loại vd: điện thoại hoặc laptop
  categoryName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 