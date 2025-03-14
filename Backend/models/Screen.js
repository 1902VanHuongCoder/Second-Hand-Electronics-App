const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({ // This collection is used to store the screen of the product
    screenSize: { type: String, required: true }, // Kích thước màn hình
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Screen', screenSchema); 