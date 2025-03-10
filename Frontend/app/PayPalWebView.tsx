import React, { useState, useRef } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

export default function PayPalWebView() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const previousUrl = useRef<string>("");

    // Ép kiểu về string để tránh lỗi "string | string[]"
    const approvalUrl = Array.isArray(params.approvalUrl) ? params.approvalUrl[0] : params.approvalUrl;
    const orderDataString = Array.isArray(params.orderData) ? params.orderData[0] : params.orderData;

    const [loading, setLoading] = useState(true);

    const handleNavigation = async (navState: WebViewNavigation) => {
        const { url } = navState;

        // Kiểm tra nếu URL hiện tại giống với URL trước đó thì bỏ qua
        if (url === previousUrl.current) {
            return;
        }
        previousUrl.current = url;

        if (url.includes("/api/paypal/success")) {
            const urlParams = new URLSearchParams(url.split("?")[1]);
            const paymentId = urlParams.get("paymentId");
            const payerId = urlParams.get("PayerID");

            if (!paymentId || !payerId) {
                Alert.alert("Lỗi", "Không lấy được thông tin thanh toán.");
                router.push("/(tabs)/postManagement");
                return;
            }

            try {
                const orderInfo = JSON.parse(orderDataString || "{}");
                const response = await axios.post("http://10.0.2.2:5000/api/orders/confirm-payment", {
                    paymentId,
                    payerId,
                    ...orderInfo
                });

                if (response.status === 200) {
                    Alert.alert("Thành công", "Thanh toán thành công!");
                } else {
                    Alert.alert("Lỗi", "Xác nhận thanh toán thất bại.");
                }
            } catch (error) {
                Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi khi xác nhận thanh toán.");
            } finally {
                router.push("/(tabs)/postManagement");
            }
        } else if (url.includes("/api/paypal/cancel")) {
            Alert.alert("Thông báo", "Thanh toán bị hủy!");
            router.push("/(tabs)/postManagement");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            <WebView
                source={{ uri: approvalUrl || "about:blank" }} // Tránh lỗi khi không có URL
                onLoadEnd={() => setLoading(false)}
                onNavigationStateChange={handleNavigation}
            />
        </View>
    );
}
