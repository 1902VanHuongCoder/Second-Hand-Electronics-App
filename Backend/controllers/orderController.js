const paypal = require('paypal-rest-sdk');
const Order = require('../models/Order');
const Product = require('../models/Product');
const moment = require('moment');

exports.confirmPayment = async (req, res) => {
    const { paymentId, payerId, productId, userId, totalPrice, newsPushDay } = req.body;
    console.log(req.body);
    // Kiểm tra xem tất cả các thông tin cần thiết có được cung cấp không
    if (!paymentId || !payerId || !productId || !userId || !totalPrice || !newsPushDay) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết để xác nhận thanh toán.' });
    }

    try {
        // Xác nhận thanh toán với PayPal
        const execute_payment_json = { payer_id: payerId };

        paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
            if (error) {
                console.error('Error executing payment:', error);
                if (error.response) {
                    console.error('PayPal response:', error.response);
                }
                return res.status(400).json({ message: 'Xác nhận thanh toán không thành công.', error: error.response ? error.response : error });
            } else {
                // Lưu thông tin đơn hàng
                const newOrder = new Order({
                    productId,
                    userId,
                    totalPrice,
                });

                await newOrder.save();

                // Cập nhật thông tin sản phẩm
                const expirationDate = moment().add(parseInt(newsPushDay), 'days').toDate();
                const product = await Product.findById(productId);
                product.isVip = true;
                product.newsPushDay = expirationDate;
                await product.save();

                res.status(200).json({ message: 'Đơn hàng đã được tạo thành công.', order: newOrder });
            }
        });
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ message: error.message });
    }
};