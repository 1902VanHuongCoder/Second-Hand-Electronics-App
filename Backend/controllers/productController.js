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
            videos: typeof req.body.videos === 'string' ? req.body.videos : '',
            location: req.body.location
        };

        const product = new Product(productData);
        const savedProduct = await product.save();

        // Thêm thông tin chi tiết cho laptop hoặc điện thoại
        const category = await Category.findById(req.body.categoryId);
        if (category.categoryName === 'Laptop') {
            const laptopData = {
                productId: savedProduct._id,
                cpuId: new mongoose.Types.ObjectId(req.body.cpuId),
                gpuId: new mongoose.Types.ObjectId(req.body.gpuId),
                ramId: new mongoose.Types.ObjectId(req.body.ramId),
                screenId: new mongoose.Types.ObjectId(req.body.screenId),
                battery: req.body.battery,
                origin: req.body.origin,
            };
            const laptop = new Laptop(laptopData);
            await laptop.save();
        } else if (category.categoryName === 'Điện thoại') {
            const phoneData = {
                productId: savedProduct._id,
                ramId: new mongoose.Types.ObjectId(req.body.ramId),
                battery: req.body.battery,
                origin: req.body.origin,
            };
            const phone = new Phone(phoneData);
            await phone.save();
        }

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

// Lấy thông tin chi tiết sản phẩm để chỉnh sửa
exports.getProductForEdit = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Bỏ qua việc kiểm tra quyền sở hữu tạm thời để debug
        // if (product.userId.toString() !== req.user.id) {
        //     return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa sản phẩm này' });
        // }

        const category = await Category.findById(product.categoryId);

        let detailData = {};
        if (category.categoryName === 'Laptop') {
            const laptop = await Laptop.findOne({ productId: product._id });
            detailData = {
                cpuId: laptop.cpuId,
                gpuId: laptop.gpuId,
                screenId: laptop.screenId,
                battery: laptop.battery,
                origin: laptop.origin
            };
        } else if (category.categoryName === 'Điện thoại') {
            const phone = await Phone.findOne({ productId: product._id });
            detailData = {
                battery: phone.battery,
                origin: phone.origin
            };
        }

        // Phân tách địa chỉ
        let locationData = {};
        if (typeof product.location === 'object') {
            locationData = product.location;
        }

        const editData = {
            id: product._id,
            categoryId: product.categoryId,
            brandId: null, // Sẽ được lấy từ version
            versionId: product.versionId,
            conditionId: product.conditionId,
            storageId: product.storageId,
            ramId: null, // Sẽ được lấy từ laptop/phone
            title: product.title,
            description: product.description,
            price: product.price,
            warranty: product.warranty,
            isVip: product.isVip,
            images: product.images,
            videos: product.videos,
            location: locationData,
            ...detailData
        };

        // Lấy thông tin version để có brandId
        const version = await Version.findById(product.versionId);
        if (version) {
            editData.brandId = version.brandId;
        }

        // Lấy thông tin ramId
        if (category.categoryName === 'Laptop') {
            const laptop = await Laptop.findOne({ productId: product._id });
            if (laptop) {
                editData.ramId = laptop.ramId;
            }
        } else if (category.categoryName === 'Điện thoại') {
            const phone = await Phone.findOne({ productId: product._id });
            if (phone) {
                editData.ramId = phone.ramId;
            }
        }

        // Lấy thông tin storageType nếu là laptop
        if (category.categoryName === 'Laptop') {
            const storage = await Storage.findById(product.storageId);
            if (storage) {
                editData.storageTypeId = storage.storageTypeId;
            }
        }

        res.status(200).json(editData);
    } catch (error) {
        console.error('Error in getProductForEdit:', error);
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Kiểm tra quyền sở hữu sản phẩm
        if (product.userId.toString() !== req.body.userId) {
            return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa sản phẩm này' });
        }

        const productData = {
            categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
            versionId: new mongoose.Types.ObjectId(req.body.versionId),
            conditionId: new mongoose.Types.ObjectId(req.body.conditionId),
            storageId: new mongoose.Types.ObjectId(req.body.storageId),
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            isVip: req.body.isVip,
            warranty: req.body.warranty,
            images: req.body.images || product.images,
            videos: req.body.videos || product.videos,
            location: req.body.location || product.location,
            updatedAt: Date.now()
        };

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });

        // Cập nhật thông tin chi tiết (laptop hoặc phone)
        const category = await Category.findById(req.body.categoryId);

        if (category.categoryName === 'Laptop') {
            const laptopData = {
                cpuId: new mongoose.Types.ObjectId(req.body.cpuId),
                gpuId: new mongoose.Types.ObjectId(req.body.gpuId),
                ramId: new mongoose.Types.ObjectId(req.body.ramId),
                screenId: new mongoose.Types.ObjectId(req.body.screenId),
                battery: req.body.battery,
                origin: req.body.origin,
                updatedAt: Date.now()
            };

            await Laptop.findOneAndUpdate({ productId: req.params.id }, laptopData);
        } else if (category.categoryName === 'Điện thoại') {
            const phoneData = {
                ramId: new mongoose.Types.ObjectId(req.body.ramId),
                battery: req.body.battery,
                origin: req.body.origin
            };

            await Phone.findOneAndUpdate({ productId: req.params.id }, phoneData);
        }

        res.status(200).json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
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
                images: product ? product.images : [],
                video: product ? product.videos : null,
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
                images: product ? product.images : [],
                video: product ? product.videos : null,
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

        const products = await Product.find({ title: searchRegex })
            .populate('categoryId', 'categoryName')
            .populate('versionId', 'versionName')
            .populate('userId', 'name avatarUrl')
            .sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.toggleHideProduct = async (req, res) => {
    const { reason } = req.body;
    const { id } = req.params;
    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Không có sản phẩm trùng khớp.' });
        }

        product.isHidden = !product.isHidden;
        product.hiddenReason = product.isHidden ? reason : '';
        await product.save();

        return res.status(200).json({ 
            isHidden: product.isHidden,
            hiddenReason: product.hiddenReason
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message });
    }
}