const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Category",
    required: true,
  },
}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand; 