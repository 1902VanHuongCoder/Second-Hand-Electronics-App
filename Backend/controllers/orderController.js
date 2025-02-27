const Order = require('../models/Order');
const Product = require('../models/Product');
const moment = require('moment');
exports.createOrder = async (req, res) => {
    const { productId, userId, totalPrice, selectedDays } = req.body;
    console.log(productId);
    if (!productId || !userId || !totalPrice || !selectedDays) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết để tạo đơn hàng.' });
    }

    try {
        const newOrder = new Order({
            productId,
            userId,
            totalPrice,
        });

        await newOrder.save();
        const expirationDate = moment().add(parseInt(selectedDays), 'days').toDate();
        const product = await Product.findById(productId);
        product.isVip = true;
        product.newsPushDay = expirationDate;
        await product.save();

        res.status(200).json({ message: 'Đơn hàng đã được tạo thành công.', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: error.message });
    }
};