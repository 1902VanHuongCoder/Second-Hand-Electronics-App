const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({ // This collection is used to store the phone's information
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ramId: { type: mongoose.Schema.Types.ObjectId, required: true },
    battery: { type: String, required: true },
    origin: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Phone', phoneSchema); 