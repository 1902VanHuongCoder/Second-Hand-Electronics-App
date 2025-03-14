const mongoose = require('mongoose');

const gpuSchema = new mongoose.Schema({ // This collection is used to store the GPU of the product
  gpuName: {
    type: String,
    required: true,
  },
}, { timestamps: true });
const Gpu = mongoose.model('Gpu', gpuSchema);

module.exports = Gpu;