const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
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