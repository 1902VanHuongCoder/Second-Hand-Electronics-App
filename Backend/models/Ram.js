const mongoose = require('mongoose');

const ramSchema = new mongoose.Schema({ // This collection is used to store the RAM of the product
  ramCapacity: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Ram = mongoose.model('Ram', ramSchema);

module.exports = Ram; 