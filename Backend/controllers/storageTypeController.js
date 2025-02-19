const StorageType = require('../models/StorageType');

// Thêm StorageType mới
exports.addStorageType = async (req, res) => {
  try {
    const { storageName } = req.body;
    const newStorageType = new StorageType({ storageName });
    await newStorageType.save();
    res.status(201).json({ success: true, data: newStorageType });
  } catch (error) {
    console.error('Lỗi thêm StorageType:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách StorageType
exports.getStorageTypes = async (req, res) => {
  try {
    const storageTypes = await StorageType.find();
    res.status(200).json({ success: true, data: storageTypes });
  } catch (error) {
    console.error('Lỗi lấy danh sách StorageType:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

