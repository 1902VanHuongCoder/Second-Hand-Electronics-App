const paypal = require('@paypal/checkout-server-sdk');
const Payment = require('../models/Payment');

// PayPal Client Configuration
const environment = process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

const paymentController = {
    // Create PayPal Order
    createOrder: async (req, res) => {
        try {
            const { amount, currency = 'USD', userId } = req.body;

            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: currency,
                        value: amount.toString()
                    }
                }]
            });

            const order = await client.execute(request);

            // Save payment details to database
            const payment = new Payment({
                orderId: order.result.id,
                paypalPaymentId: order.result.id,
                userId,
                amount,
                currency,
                status: 'pending'
            });
            await payment.save();

            res.json({
                orderId: order.result.id,
                status: 'CREATED'
            });
        } catch (error) {
            console.error('Error creating PayPal order:', error);
            res.status(500).json({ error: 'Failed to create PayPal order' });
        }
    },

    // Capture PayPal Payment
    capturePayment: async (req, res) => {
        try {
            const { orderID } = req.body;

            const request = new paypal.orders.OrdersCaptureRequest(orderID);
            const capture = await client.execute(request);

            // Update payment status in database
            await Payment.findOneAndUpdate(
                { orderId: orderID },
                {
                    status: 'completed',
                    paypalPaymentId: capture.result.purchase_units[0].payments.captures[0].id
                }
            );

            res.json({
                status: 'COMPLETED',
                captureId: capture.result.purchase_units[0].payments.captures[0].id
            });
        } catch (error) {
            console.error('Error capturing PayPal payment:', error);
            res.status(500).json({ error: 'Failed to capture payment' });
        }
    },

    // Get Payment Details
    getPaymentDetails: async (req, res) => {
        try {
            const { orderId } = req.params;
            const payment = await Payment.findOne({ orderId });

            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }

            res.json(payment);
        } catch (error) {
            console.error('Error fetching payment details:', error);
            res.status(500).json({ error: 'Failed to fetch payment details' });
        }
    }
};

module.exports = paymentController; 