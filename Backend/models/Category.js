const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({ // This collection is used to store the category of the product (e.g: phone, laptop, ...)
  // Tên loại vd: điện thoại hoặc laptop
  categoryName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 