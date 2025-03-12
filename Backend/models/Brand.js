const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  // Tên hãng vd: apple, samsung ...
  brandName: {
    type: String,
    required: true,
  },
  // ID loại sản phẩm
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Category",
    required: true,
  },
}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand; 