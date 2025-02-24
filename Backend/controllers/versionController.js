const Version = require('../models/Version');

// Thêm Version mới
exports.addVersion = async (req, res) => {
  try {
    const { versionName, brandId } = req.body;
    const newVersion = new Version({ versionName, brandId });
    await newVersion.save();
    res.status(201).json({ success: true, data: newVersion });
  } catch (error) {
    console.error('Lỗi thêm Version:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách Version
exports.getVersions = async (req, res) => {
  try {
    const versions = await Version.find()
      .populate('brandId')
      .lean();

    console.log('Versions from DB:', versions); // Debug log

    res.status(200).json({ 
      success: true, 
      data: versions 
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách Version:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
}; 