const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
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