const mongoose = require('mongoose');
const Screen = require('../models/Screen');

// Lấy tất cả màn hình
exports.getAllScreens = async (req, res) => {
    try {
        const screens = await Screen.find();
        res.status(200).json({ 
            success: true, 
            data: screens 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Lấy màn hình theo ID
exports.getScreenById = async (req, res) => {
    try {
        const screen = await Screen.findById(req.params.id);
        if (!screen) return res.status(404).json({ 
            success: false, 
            message: 'Screen not found' 
        });
        res.status(200).json({ 
            success: true, 
            data: screen 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Thêm màn hình mới
exports.createScreen = async (req, res) => {
    const screenData = {
        screenSize: req.body.screenSize,
    };

    const screen = new Screen(screenData);
    try {
        const savedScreen = await screen.save();
        res.status(201).json({ 
            success: true, 
            data: savedScreen 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Cập nhật màn hình
exports.updateScreen = async (req, res) => {
    try {
        const updatedScreen = await Screen.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedScreen) return res.status(404).json({ message: 'Screen not found' });
        res.status(200).json(updatedScreen);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa màn hình
exports.deleteScreen = async (req, res) => {
    try {
        const deletedScreen = await Screen.findByIdAndDelete(req.params.id);
        if (!deletedScreen) return res.status(404).json({ message: 'Screen not found' });
        res.status(200).json({ message: 'Screen deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 