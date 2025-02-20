const Product = require('../models/Product');
const Laptop = require('../models/Laptop');
const Phone = require('../models/Phone');
const Ram = require('../models/Ram');
const Screen = require('../models/Screen');
const User = require('../models/User');
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
                const product = await Product.findById(laptop.productId).select('-images');
                if (!product) return null;

                const ram = await Ram.findById(laptop.ramId);
                const user = await User.findById(product.userId);

                return {
                    id: product._id,
                    title: product.title,
                    configuration: product.description,
                    price: product.price,
                    address: product.location,
                    postingDate: product.createdAt,
                    nameUser: user ? user.name : null,
                    type: 'laptop' // Thêm loại sản phẩm
                };
            })
        );

        // Kết hợp thông tin sản phẩm từ điện thoại
        const phoneProducts = await Promise.all(
            phones.map(async (phone) => {
                const product = await Product.findById(phone.productId).select('-images');
                if (!product) return null;

                const ram = await Ram.findById(phone.ramId);
                const user = await User.findById(product.userId);

                return {
                    id: product._id,
                    title: product.title,
                    configuration: product.description,
                    price: product.price,
                    address: product.location,
                    postingDate: product.createdAt,
                    nameUser: user ? user.name : null,
                    type: 'phone' // Thêm loại sản phẩm
                };
            })
        );

        // Lọc ra các sản phẩm không hợp lệ
        const allProducts = [...laptopProducts, ...phoneProducts].filter(product => product !== null);

        res.status(200).json(allProducts);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}; 