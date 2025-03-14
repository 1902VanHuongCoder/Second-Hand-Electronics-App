const mongoose = require('mongoose');

const cpuSchema = new mongoose.Schema({ // This collection is used to store the CPU of the product
  cpuName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Cpu = mongoose.model('Cpu', cpuSchema);
module.exports = Cpu;