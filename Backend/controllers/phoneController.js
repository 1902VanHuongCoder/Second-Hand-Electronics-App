const mongoose = require('mongoose');
const Phone = require('../models/Phone');

// Lấy tất cả điện thoại
exports.getAllPhones = async (req, res) => {
    try {
        const phones = await Phone.find();
        res.status(200).json(phones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy điện thoại theo ID
exports.getPhoneById = async (req, res) => {
    try {
        const phone = await Phone.findById(req.params.id);
        if (!phone) return res.status(404).json({ message: 'Phone not found' });
        res.status(200).json(phone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm điện thoại mới
exports.createPhone = async (req, res) => {
    const { productId, ramId, battery, origin } = req.body;

    // Kiểm tra xem productId và ramId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(ramId)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    // Kiểm tra xem ramId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(ramId)) {
        return res.status(400).json({ message: 'ramId không hợp lệ' });
    }

    const phoneData = {
        productId: new mongoose.Types.ObjectId(productId),
        ramId: new mongoose.Types.ObjectId(ramId),
        battery,
        origin,
    };

    const phone = new Phone(phoneData);
    try {
        const savedPhone = await phone.save();
        res.status(201).json(savedPhone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật điện thoại
exports.updatePhone = async (req, res) => {
    try {
        const updatedPhone = await Phone.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPhone) return res.status(404).json({ message: 'Phone not found' });
        res.status(200).json(updatedPhone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa điện thoại
exports.deletePhone = async (req, res) => {
    try {
        const deletedPhone = await Phone.findByIdAndDelete(req.params.id);
        if (!deletedPhone) return res.status(404).json({ message: 'Phone not found' });
        res.status(200).json({ message: 'Phone deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 