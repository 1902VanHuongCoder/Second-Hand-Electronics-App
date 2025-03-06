const Product = require('../models/Product');
const Laptop = require('../models/Laptop');
const Phone = require('../models/Phone');
const Category = require('../models/Category');
const Version = require('../models/Version');
const Brand = require('../models/Brand');

exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const products = await Product.find({ userId: userId });

        const productDetails = await Promise.all(products.map(async (product) => {
            const category = await Category.findById(product.categoryId);
            const version = await Version.findById(product.versionId);
            const brand = version ? await Brand.findById(version.brandId) : null;

            // Xử lý địa chỉ an toàn hơn
            let address = '';
            if (product.location) {
                if (typeof product.location === 'object') {
                    address = product.location.fullAddress || '';
                } else {
                    address = product.location || '';
                }
            }

            return {
                id: product._id,
                name: product.title,
                price: product.price,
                postingDate: product.createdAt,
                expirationDate: product.updatedAt,
                views: product.view,
                image: product.images[0] || null,
                type: category ? category.categoryName : null,
                brandName: brand ? brand.brandName : null,
                status: product.isSold ? 'Đã bán' : 'Đang bán',
                address: address, // Sử dụng địa chỉ đã được xử lý
                location: product.location || null, // Gửi toàn bộ object location nếu cần
                isHidden: product.isHidden,
                hiddenReason: product.hiddenReason
            };
        }));

        res.status(200).json(productDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 