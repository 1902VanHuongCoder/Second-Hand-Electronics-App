const Product = require('../models/Product');
const Laptop = require('../models/Laptop');
const Phone = require('../models/Phone');
const Ram = require('../models/Ram');
const Screen = require('../models/Screen');
const Cpu = require('../models/Cpu');
const Gpu = require('../models/Gpu');
const User = require('../models/User');
const Version = require('../models/Version');
const Brand = require('../models/Brand');
const Storage = require('../models/Storage');
const StorageType = require('../models/StorageType');

// Lấy tất cả sản phẩm cho trang chủ
exports.getHomeProducts = async (req, res) => {
    try {
        // Lấy tất cả laptop
        const laptops = await Laptop.find();
        // Lấy tất cả điện thoại
        const phones = await Phone.find();

        // Kết hợp thông tin sản phẩm từ laptop
        const laptopProducts = await Promise.all(
            laptops.map(async (laptop) => {
                const product = await Product.findOne({ _id: laptop.productId, isHidden: false });
                if (!product) return null;

                const ram = await Ram.findById(laptop.ramId);
                const user = await User.findById(product.userId);
                const screen = await Screen.findById(laptop.screenId);
                const cpu = await Cpu.findById(laptop.cpuId);
                const version = await Version.findById(product.versionId);
                const brand = version ? await Brand.findById(version.brandId) : null;
                const gpu = await Gpu.findById(laptop.gpuId);
                const storage = await Storage.findById(laptop.storageId);
                const storageType = storage ? await StorageType.findById(storage.storageTypeId) : null;

                console.log(product);

                return {
                    id: product._id,
                    title: product.title,
                    images: product ? product.images : [],
                    video: product ? product.videos : null,
                    configuration: product.description,
                    price: product.price,
                    address: product.location.fullAddress,
                    postingDate: product.createdAt,
                    nameUser: user ? user.name : null,
                    avatarUrl: user ? user.avatarUrl : null,
                    brandName: brand ? brand.brandName : null,
                    ramCapacity: ram ? ram.capacity : null,
                    cpuName: cpu ? cpu.name : null,
                    screenSize: screen ? screen.screenSize : null,
                    gpuName: gpu ? gpu.name : null,
                    storageCapacity: storage ? storage.storageCapacity : null,
                    storageType: storageType ? storageType.storageName : null,
                    type: 'laptop'
                };
            })
        );

        // Kết hợp thông tin sản phẩm từ điện thoại
        const phoneProducts = await Promise.all(
            phones.map(async (phone) => {
                const product = await Product.findOne({ _id: phone.productId, isHidden: false });
                if (!product) return null;

                const ram = await Ram.findById(phone.ramId);
                const user = await User.findById(product.userId);
                const version = await Version.findById(product.versionId);
                const brand = version ? await Brand.findById(version.brandId) : null;
                console.log(product);
                return {
                    id: product._id,
                    title: product.title,
                    images: product ? product.images : [],
                    video: product ? product.videos : null,
                    configuration: product.description,
                    avatarUrl: user ? user.avatarUrl : null,
                    price: product.price,
                    address: product.location.fullAddress,
                    postingDate: product.createdAt,
                    nameUser: user ? user.name : null,
                    brandName: brand ? brand.brandName : null,
                    ramCapacity: ram ? ram.capacity : null,
                    type: 'phone'
                };
            })
        );

        // Lọc ra các sản phẩm không hợp lệ
        const allProducts = [...laptopProducts, ...phoneProducts].filter(product => product !== null);

        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

exports.getProductsByBrand = async (req, res) => {
    try {
        const { brandId } = req.params;

        // Lấy tất cả các phiên bản thuộc brand
        const versions = await Version.find({ brandId }).select("_id");
        const versionIds = versions.map((version) => version._id);

        // Lấy tất cả sản phẩm thuộc brand đó
        const products = await Product.find({ versionId: { $in: versionIds }, isHidden: false })
            .populate({
                path: "versionId",
                populate: { path: "brandId", model: "Brand" },
            })
            .exec();

        // Thêm thông tin người bán vào sản phẩm
        const productsWithUser = await Promise.all(
            products.map(async (product) => {
                const user = await User.findById(product.userId);
                return {
                    id: product._id,
                    title: product.title,
                    images: product.images,
                    price: product.price,
                    description: product.description,
                    address: product.location?.fullAddress || "Không có địa chỉ",
                    postingDate: product.createdAt,
                    nameUser: user ? user.name : "Không rõ",
                    avatarUrl: user ? user.avatarUrl : null,
                    brandName: product.versionId.brandId?.brandName || "Không rõ",
                };
            })
        );

        res.status(200).json(productsWithUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};