const Storage = require('../models/Storage');

// Thêm Storage mới
exports.addStorage = async (req, res) => {
  try {
    const { storageCapacity, storageTypeId } = req.body;
    const newStorage = new Storage({ storageCapacity, storageTypeId });
    await newStorage.save();
    res.status(201).json({ success: true, data: newStorage });
  } catch (error) {
    console.error('Lỗi thêm Storage:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách Storage
exports.getStorages = async (req, res) => {
  try {
    const storages = await Storage.find()
      .populate('storageTypeId')
      .lean(); // Sử dụng lean() để có thể chuyển đổi thành plain object
    res.status(200).json({ 
      data: storages 
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách Storage:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
}; 