const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({ // This collection is used to store user's pushing news  
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
},)

module.exports = mongoose.model('Order', orderSchema); 