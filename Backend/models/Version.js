const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({ // This collection is used to store the version of the product (e.g: 1.0, 2.0, ...)
  versionName: {
    type: String,
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
}, { timestamps: true });

const Version = mongoose.model('Version', versionSchema);

module.exports = Version; 