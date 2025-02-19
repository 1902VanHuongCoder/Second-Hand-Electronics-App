const Brand = require('../models/Brand');

// Thêm Brand mới
exports.addBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    const newBrand = new Brand({ brandName });
    await newBrand.save();
    res.status(201).json({ success: true, data: newBrand });
  } catch (error) {
    console.error('Lỗi thêm Brand:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách Brand
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    console.error('Lỗi lấy danh sách Brand:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}; 