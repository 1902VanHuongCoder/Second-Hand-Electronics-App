const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
    screenSize: { type: String, required: true }, // Kích thước màn hình
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Screen', screenSchema); 