const mongoose = require('mongoose');

const ramSchema = new mongoose.Schema({
  ramCapacity: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Ram = mongoose.model('Ram', ramSchema);

module.exports = Ram; 