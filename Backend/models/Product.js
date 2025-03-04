const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    versionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    conditionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    storageId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    view: { type: Number, default: 0 },
    isVip: { type: Boolean, default: false },
    isSold: { type: Boolean, default: false },
    warranty: { type: String, default: '' },
    images: { type: [String], default: [] },
    videos: { type: String, default: '' },
    location: {
        provinceCode: {
            type: String,
            required: true
        },
        provinceName: {
            type: String,
            required: false
        },
        districtCode: {
            type: String,
            required: true
        },
        districtName: {
            type: String,
            required: false
        },
        wardCode: {
            type: String,
            required: true
        },
        wardName: {
            type: String,
            required: false
        },
        detailAddress: {
            type: String,
            required: false
        },
        fullAddress: {
            type: String,
            required: false
        }
    },
    newsPushDay: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
