const mongoose = require('mongoose');

const storageTypeSchema = new mongoose.Schema({
  storageName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const StorageType = mongoose.model('StorageType', storageTypeSchema);
module.exports = StorageType;
