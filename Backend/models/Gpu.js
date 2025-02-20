const mongoose = require('mongoose');

const gpuSchema = new mongoose.Schema({
  gpuName: {
    type: String,
    required: true,
  },
}, { timestamps: true });
const Gpu = mongoose.model('Gpu', gpuSchema);

module.exports = Gpu;