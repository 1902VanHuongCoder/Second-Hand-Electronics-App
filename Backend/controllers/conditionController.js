const Condition = require('../models/Condition');

// Thêm Condition mới
exports.addCondition = async (req, res) => {
  try {
    const { condition } = req.body;
    const newCondition = new Condition({ condition });
    await newCondition.save();
    res.status(201).json({ success: true, data: newCondition });
  } catch (error) {
    console.error('Lỗi thêm Condition:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách Condition
exports.getConditions = async (req, res) => {
  try {
    const conditions = await Condition.find();
    res.status(200).json({ data: conditions });
  } catch (error) {
    console.error('Lỗi lấy danh sách Condition:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 