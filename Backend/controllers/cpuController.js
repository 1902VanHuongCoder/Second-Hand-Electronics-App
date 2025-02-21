const Cpu = require('../models/Cpu');

// Thêm CPU mới
exports.addCpu = async (req, res) => {
  try {
    const { cpuName } = req.body;
    const newCpu = new Cpu({ cpuName });
    await newCpu.save();
    res.status(201).json({ success: true, data: newCpu });
  } catch (error) {
    console.error('Lỗi thêm CPU:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách CPU
exports.getCpus = async (req, res) => {
  try {
    const cpus = await Cpu.find();
    res.status(200).json({ success: true, data: cpus });
  } catch (error) {
    console.error('Lỗi lấy danh sách CPU:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};