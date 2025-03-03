const mongoose = require('mongoose');
const Product = require('../models/Product');
const Laptop = require('../models/Laptop');
const Phone = require('../models/Phone');
const Ram = require('../models/Ram');
const User = require('../models/User');
const Version = require('../models/Version');
const Brand = require('../models/Brand');
const Cpu = require('../models/Cpu');
const Gpu = require('../models/Gpu');
const Storage = require('../models/Storage');
const StorageType = require('../models/StorageType');
const Category = require('../models/Category');
const Screen = require('../models/Screen');

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
    try {
        const productData = {
            categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
            userId: new mongoose.Types.ObjectId(req.body.userId),
            versionId: new mongoose.Types.ObjectId(req.body.versionId),
            conditionId: new mongoose.Types.ObjectId(req.body.conditionId),
            storageId: new mongoose.Types.ObjectId(req.body.storageId),
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            view: req.body.view || 0,
            isVip: req.body.isVip,
            isSold: req.body.isSold || false,
            warranty: req.body.warranty,
            images: req.body.images || [],
            videos: req.body.videos || [],
            location: req.body.location
        };

        const product = new Product(productData);
        const savedProduct = await product.save();

        res.status(201).json({
            success: true,
            data: savedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
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

// Lấy thông tin chi tiết sản phẩm
exports.getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        category = product ? await Category.findById(product.categoryId) : null;
        console.log(category.categoryName)
        let formattedAddress = '';
        if (product.location) {
            if (typeof product.location === 'object') {
                formattedAddress = product.location.fullAddress || '';
            } else {
                formattedAddress = product.location;
            }
        }
        let detail = {};
        if (category.categoryName === 'Laptop') {
            const laptop = await Laptop.findOne({ productId: product._id });

            const ram = await Ram.findById(laptop.ramId);
            const user = await User.findById(product.userId);
            const screen = laptop ? await Screen.findById(laptop.screenId) : null;
            const cpu = laptop ? await Cpu.findById(laptop.cpuId) : null;
            const version = await Version.findById(product.versionId);
            const brand = version ? await Brand.findById(version.brandId) : null;
            const gpu = laptop ? await Gpu.findById(laptop.gpuId) : null;
            const storage = await Storage.findById(product.storageId);
            const storageType = storage ? await StorageType.findById(storage.storageTypeId) : null;

            detail = {
                id: product._id,
                title: product.title,
                configuration: product.description,
                price: product.price,
                address: formattedAddress,
                postingDate: product.createdAt,
                battery: laptop ? laptop.battery : null,
                nameUser: user ? user.name : null,
                versionName: version ? version.versionName : null,
                brandName: brand ? brand.brandName : null,
                ramCapacity: ram ? ram.ramCapacity : null,
                cpuName: cpu ? cpu.cpuName : null,
                screenSize: screen ? screen.screenSize : null,
                gpuName: gpu ? gpu.gpuName : null,
                storageCapacity: storage ? storage.storageCapacity : null,
                storageType: storageType ? storageType.storageName : null,
                type: 'laptop'
            };
        } else if (category.categoryName === 'Điện thoại') {
            const phone = await Phone.findOne({ productId: product._id });
            const user = await User.findById(product.userId);
            const ram = phone ? await Ram.findById(phone.ramId) : null;
            const version = await Version.findById(product.versionId);
            const brand = version ? await Brand.findById(version.brandId) : null;
            const storage = await Storage.findById(product.storageId);
            const storageType = storage ? await StorageType.findById(storage.storageTypeId) : null;
            detail = {
                id: product._id,
                title: product.title,
                configuration: product.description,
                price: product.price,
                address: formattedAddress,
                postingDate: product.createdAt,
                nameUser: user ? user.name : null,
                versionName: version ? version.versionName : null,
                brandName: brand ? brand.brandName : null,
                ramCapacity: ram ? ram.ramCapacity : null,
                battery: phone ? phone.battery : null,
                storageCapacity: storage ? storage.storageCapacity : null,
                storageType: storageType ? storageType.storageName : null,
                type: 'phone'
            };
        }
        console.log(detail)
        res.status(200).json(detail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { searchTerm } = req.query;

        if (!searchTerm) {
            return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
        }

        const searchRegex = new RegExp(searchTerm, 'i');

        const products = await Product.find({
            $or: [
                { title: searchRegex },
                { description: searchRegex },
                { 'location.fullAddress': searchRegex }
            ]
        })
            .populate('categoryId', 'categoryName')
            .populate('versionId', 'versionName')
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}