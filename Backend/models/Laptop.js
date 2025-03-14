const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({ // This collection is used to store the laptop product
    productId: { type: mongoose.Schema.Types.ObjectId, required: true }, // product id
    cpuId: { type: mongoose.Schema.Types.ObjectId, required: true }, // cpu id
    gpuId: { type: mongoose.Schema.Types.ObjectId, required: true }, // gpu id
    ramId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ram id
    screenId: { type: mongoose.Schema.Types.ObjectId, required: true }, // screen id
    battery: { type: String, required: true }, // battery
    origin: { type: String, required: true }, // origin
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Laptop', laptopSchema);
