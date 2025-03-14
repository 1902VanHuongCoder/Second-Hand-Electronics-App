const mongoose = require('mongoose');

const storageTypeSchema = new mongoose.Schema({ // This collection is used to store the storage type of the product (e.g: HDD, SSD, ...)
  storageName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const StorageType = mongoose.model('StorageType', storageTypeSchema);
module.exports = StorageType;
