const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({ // This collection is used to store the post's information 
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID loại sản phẩm 'Điện thoại' hoặc 'Laptop
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID của người đăng bán
    versionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID Loại sản phẩm vd: SamSung galaxy s22...
    conditionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID của tình trạng sản phẩm
    storageId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID bộ nhớ
    title: { type: String, required: true }, // Tên sản phẩm
    description: { type: String, required: true }, // Mô tả sản phẩm
    price: { type: Number, required: true }, // Giá sản phẩm
    view: { type: Number, default: 0 }, // Lượt xem
    isVip: { type: Boolean, default: false }, // Trạng thái vip khi đẩy tin
    isSold: { type: Boolean, default: false }, // Đã bán hay chưa
    warranty: { type: String, default: '' }, // Thời hạn bảo hành
    images: { type: [String], default: [] }, // Hình ảnh
    videos: { type: String, default: '' }, // Videos
    location: {
        provinceCode: {
            type: Number,
            required: true
        },
        provinceName: {
            type: String,
            required: false
        },
        districtCode: {
            type: Number,
            required: true
        },
        districtName: {
            type: String,
            required: false
        },
        wardCode: {
            type: Number,
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
    }, // Vị trí và id của vị trí
    isHidden: { type: Boolean, default: false }, // Trạng thái ẩn tin
    hiddenReason: { type: String, default: '' }, // Lưu lí do ẩn tin
    newsPushDay: { type: Date }, // Ngày hết hạn của đẩy tin 
    pushNews: { type: Date }, // Ngày đẩy tin
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    expirationDate: { 
        type: Date, 
        default: function() {
            const date = new Date(this.createdAt || Date.now());
            date.setDate(date.getDate() + 60);
            return date;
        }
    } // Ngày hết hạn của bài đăng
});

module.exports = mongoose.model('Product', productSchema);
