const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({ // This collection is used to store the storage of the product
  storageCapacity: {
    type: String,
    required: true,
  },
  storageTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StorageType',
    required: false,
  },
}, { timestamps: true });

const Storage = mongoose.model('Storage', storageSchema);

module.exports = Storage; 