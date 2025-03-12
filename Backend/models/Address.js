const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    // Mã tỉnh/thành phố
    provinceCode: {
        type: String,
        required: true
    }, 
    // Tên tỉnh/thành phố
    provinceName: {
        type: String,
        required: true
    },
    // Mã quận/huyện
    districtCode: {
        type: String,
        required: true
    },
    // Tên quận/huyện
    districtName: {
        type: String,
        required: true
    },
    // Mã phường/xã
    wardCode: {
        type: String,
        required: true
    },
    // Tên phường/xã
    wardName: {
        type: String,
        required: true
    },
    // Địa chỉ chi tiết (ví dụ: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1")
    detailAddress: {
        type: String,
        required: true
    },
    // Địa chỉ đầy đủ (ghép từ các trường trên để hiển thị)
    fullAddress: {
        type: String,
        required: true
    },
    // ID của người dùng liên kết với địa chỉ này
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
     // Cờ đánh dấu đây có phải địa chỉ mặc định của người dùng không
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