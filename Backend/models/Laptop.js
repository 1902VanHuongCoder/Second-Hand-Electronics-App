const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    cpuId: { type: mongoose.Schema.Types.ObjectId, required: true },
    gpuId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ramId: { type: mongoose.Schema.Types.ObjectId, required: true },
    screenId: { type: mongoose.Schema.Types.ObjectId, required: true },
    battery: { type: String, required: true },
    origin: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Laptop', laptopSchema);
