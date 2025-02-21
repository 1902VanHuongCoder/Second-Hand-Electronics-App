const Product = require('../models/Product');
const Laptop = require('../models/Laptop');
const Ram = require('../models/Ram');
const Screen = require('../models/Screen');

// Lấy tất cả sản phẩm cho trang chủ
exports.getHomeProducts = async (req, res) => {
    try {
        // Lấy tất cả laptop
        const laptops = await Laptop.find();

        // Lấy thông tin sản phẩm cho từng laptop
        const products = await Promise.all(
            laptops.map(async (laptop) => {
                const product = await Product.findById(laptop.productId).select('-images'); // Lấy thông tin sản phẩm, loại bỏ trường images
                
                // Lấy thông tin RAM và màn hình
                const ram = await Ram.findById(laptop.ramId);
                const screen = await Screen.findById(laptop.screenId);

                return { laptop, product, ram, screen };
            })
        );

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 