const paypal = require('paypal-rest-sdk');
const Order = require('../models/Order');
const Product = require('../models/Product');
const moment = require('moment');

exports.confirmPayment = async (req, res) => {
    const { paymentId, payerId, productId, userId, totalPrice, newsPushDay } = req.body;
    // Kiểm tra xem tất cả các thông tin cần thiết có được cung cấp không
    if (!paymentId || !payerId || !productId || !userId || !totalPrice || !newsPushDay) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết để xác nhận thanh toán.' });
    }

    const product = await Product.findById(productId);

    const currentDate = moment().startOf('day'); // Ngày hiện tại (00:00:00)
    const pushNewsDate = product.pushNews ? moment(product.pushNews).startOf('day') : null;

    // Kiểm tra nếu sản phẩm đã đẩy tin trong ngày hôm nay
    if (pushNewsDate && pushNewsDate.isSame(currentDate, 'day')) {
        return res.status(400).json({ message: "Sản phẩm đã được đẩy tin hôm nay, hãy thử lại vào ngày mai." });
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
                // Cập nhật thông tin sản phẩm
                const product = await Product.findById(productId);
                const currentDate = moment();

                const currentExpirationDate = moment(product.newsPushDay);

                if (currentExpirationDate.isAfter(currentDate)) {
                    return res.status(400).json({ message: "Sản phẩm vẫn còn hiệu lực, không thể đẩy tin." });
                }
                else {
                    // Lưu thông tin đơn hàng
                    const newOrder = new Order({
                        productId,
                        userId,
                        totalPrice,
                    });

                    await newOrder.save();

                    product.isVip = true;
                    product.newsPushDay = moment().add(parseInt(newsPushDay), 'days').toDate();
                    product.pushNews = new Date();
                    await product.save();

                    res.status(200).json({ message: 'Đơn hàng đã được tạo thành công.', order: newOrder });
                }
            }
        });
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ message: error.message });
    }
};