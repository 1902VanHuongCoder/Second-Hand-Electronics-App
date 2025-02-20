const mongoose = require('mongoose');
const Laptop = require('../models/Laptop');

// Lấy tất cả laptop
exports.getAllLaptops = async (req, res) => {
    try {
        const laptops = await Laptop.find();
        res.status(200).json(laptops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy laptop theo ID
exports.getLaptopById = async (req, res) => {
    try {
        const laptop = await Laptop.findById(req.params.id);
        if (!laptop) return res.status(404).json({ message: 'Laptop not found' });
        res.status(200).json(laptop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm laptop mới
exports.createLaptop = async (req, res) => {
    const laptopData = {
        productId: new mongoose.Types.ObjectId(req.body.productId),
        cpuId: new mongoose.Types.ObjectId(req.body.cpuId),
        gpuId: new mongoose.Types.ObjectId(req.body.gpuId),
        ramId: new mongoose.Types.ObjectId(req.body.ramId),
        screenId: new mongoose.Types.ObjectId(req.body.screenId),
        battery: req.body.battery,
        origin: req.body.origin,
    };

    const laptop = new Laptop(laptopData);
    try {
        const savedLaptop = await laptop.save();
        res.status(201).json(savedLaptop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật laptop
exports.updateLaptop = async (req, res) => {
    try {
        const updatedLaptop = await Laptop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLaptop) return res.status(404).json({ message: 'Laptop not found' });
        res.status(200).json(updatedLaptop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa laptop
exports.deleteLaptop = async (req, res) => {
    try {
        const deletedLaptop = await Laptop.findByIdAndDelete(req.params.id);
        if (!deletedLaptop) return res.status(404).json({ message: 'Laptop not found' });
        res.status(200).json({ message: 'Laptop deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
