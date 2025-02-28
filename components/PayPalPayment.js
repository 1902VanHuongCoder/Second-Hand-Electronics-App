import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const API_URL = 'YOUR_API_URL'; // Replace with your backend API URL

const PayPalPayment = ({ amount, onSuccess, onCancel }) => {
    const [paypalUrl, setPaypalUrl] = useState(null);
    const [orderId, setOrderId] = useState(null);

    const createOrder = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/payments/create-order`, {
                amount,
                currency: 'USD'
            });
            setOrderId(response.data.orderId);
            // Generate PayPal button HTML
            const paypalHTML = `
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD"></script>
                </head>
                <body>
                    <div id="paypal-button-container"></div>
                    <script>
                        paypal.Buttons({
                            createOrder: () => "${response.data.orderId}",
                            onApprove: async (data) => {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'success',
                                    orderID: data.orderID
                                }));
                            },
                            onCancel: () => {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'cancel'
                                }));
                            },
                            onError: (err) => {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'error',
                                    error: err
                                }));
                            }
                        }).render('#paypal-button-container');
                    </script>
                </body>
                </html>
            `;
            setPaypalUrl(`data:text/html;charset=utf-8,${encodeURIComponent(paypalHTML)}`);
        } catch (error) {
            console.error('Error creating order:', error);
            Alert.alert('Error', 'Failed to create PayPal order');
        }
    };

    const handleWebViewMessage = async (event) => {
        const data = JSON.parse(event.nativeEvent.data);

        switch (data.type) {
            case 'success':
                try {
                    // Capture the payment
                    const response = await axios.post(`${API_URL}/api/payments/capture-payment`, {
                        orderID: data.orderID
                    });

                    if (response.data.status === 'COMPLETED') {
                        onSuccess(response.data);
                    }
                } catch (error) {
                    console.error('Error capturing payment:', error);
                    Alert.alert('Error', 'Failed to capture payment');
                }
                break;

            case 'cancel':
                onCancel();
                break;

            case 'error':
                Alert.alert('Error', 'Payment failed');
                break;
        }
    };

    React.useEffect(() => {
        createOrder();
    }, []);

    if (!paypalUrl) {
        return null;
    }

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: paypalUrl }}
                onMessage={handleWebViewMessage}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    webview: {
        flex: 1
    }
});

export default PayPalPayment; 