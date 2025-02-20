const mongoose = require('mongoose');
const Product = require('../models/Product');

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
    const productData = {
        categoryId: new mongoose.Types.ObjectId(req.body.categoryId), // Sử dụng new
        userId: new mongoose.Types.ObjectId(req.body.userId), // Sử dụng new
        versionId: new mongoose.Types.ObjectId(req.body.versionId), // Sử dụng new
        conditionId: new mongoose.Types.ObjectId(req.body.conditionId), // Sử dụng new
        storageId: new mongoose.Types.ObjectId(req.body.storageId), // Sử dụng new
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        view: req.body.view || 0,
        isSold: req.body.isSold || false,
        warranty: req.body.warranty || '',
        images: req.body.images || [],
        videos: req.body.videos || [],
        location: req.body.location || '',
    };

    const product = new Product(productData);
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 