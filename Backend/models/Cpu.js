const mongoose = require('mongoose');

const cpuSchema = new mongoose.Schema({
  cpuName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Cpu = mongoose.model('Cpu', cpuSchema);
module.exports = Cpu;