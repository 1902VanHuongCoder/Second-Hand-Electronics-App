const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    provinceCode: {
        type: String,
        required: true
    },
    provinceName: {
        type: String,
        required: true
    },
    districtCode: {
        type: String,
        required: true
    },
    districtName: {
        type: String,
        required: true
    },
    wardCode: {
        type: String,
        required: true
    },
    wardName: {
        type: String,
        required: true
    },
    detailAddress: {
        type: String,
        required: true
    },
    fullAddress: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Address', addressSchema); 