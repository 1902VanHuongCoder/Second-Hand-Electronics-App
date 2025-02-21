const Ram = require('../models/Ram');

// Thêm RAM mới
exports.addRam = async (req, res) => {
  try {
    const { ramCapacity } = req.body;
    const newRam = new Ram({ ramCapacity });
    await newRam.save();
    res.status(201).json({ success: true, data: newRam });
  } catch (error) {
    console.error('Lỗi thêm RAM:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách RAM
exports.getRams = async (req, res) => {
  try {
    const rams = await Ram.find();
    res.status(200).json({ success: true, data: rams });
  } catch (error) {
    console.error('Lỗi lấy danh sách RAM:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}; 