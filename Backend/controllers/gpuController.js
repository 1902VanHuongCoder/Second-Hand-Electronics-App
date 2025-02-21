const Gpu = require('../models/Gpu');

// Thêm GPU mới
exports.addGpu = async (req, res) => {
  try {
    const { gpuName } = req.body;
    const newGpu = new Gpu({ gpuName });
    await newGpu.save();
    res.status(201).json({ success: true, data: newGpu });
  } catch (error) {
    console.error('Lỗi thêm GPU:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách GPU
exports.getGpus = async (req, res) => {
  try {
    const gpus = await Gpu.find();
    res.status(200).json({ success: true, data: gpus });
  } catch (error) {
    console.error('Lỗi lấy danh sách GPU:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};