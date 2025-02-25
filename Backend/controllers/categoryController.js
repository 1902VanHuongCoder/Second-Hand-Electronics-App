const Category = require('../models/Category');

// Thêm Category mới
exports.addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const newCategory = new Category({ categoryName });
    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error('Lỗi thêm Category:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách Category
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().select('_id categoryName');
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Lỗi lấy danh sách Category:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}; 