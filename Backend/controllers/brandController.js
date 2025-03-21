const Brand = require('../models/Brand');

// Thêm Brand mới
exports.addBrand = async (req, res) => {
  try {
    const { brandName , categoryId} = req.body;
    const newBrand = new Brand({ brandName,categoryId });
    await newBrand.save();
    res.status(201).json({ success: true, data: newBrand });
  } catch (error) {
    console.error('Lỗi thêm Brand:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách Brand theo categoryId
exports.getBrands = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const query = categoryId ? { categoryId } : {};
    const brands = await Brand.find(query);
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    console.error('Lỗi lấy danh sách Brand:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}; 

exports.getBrandsById = async (req, res) => {
  const { categoryId } = req.params;
  console.log("<---------------------- categoryId ----------------------->", categoryId);
  try {
    const brands = await Brand.find({ categoryId });
    console.log(brands);
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}