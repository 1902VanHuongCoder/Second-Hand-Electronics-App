import { Text, View, Image, TouchableHighlight } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { useLocalSearchParams } from "expo-router";
import axios from 'axios';
import * as PayPal from 'react-native-paypal-wrapper';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Notification from "@/components/Notification";
import { NotificationContext } from "@/context/NotificationContext";
interface Product {
    id: string;
    title: string;
    price: number;
    images: String;
}
export default function PushNews() {
    console.log('PayPal:', PayPal);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { id, totalPrice, selectedDays } = useLocalSearchParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [product, setProduct] = useState<Product | null>(null);
    const { notifications, showNotification } = useContext(NotificationContext);
    const choosePayMents = [
        { id: 1, icon: "paypal", name: "PayPal" },
        { id: 2, icon: "credit-card", name: "VN Pay" },
    ];

    // Chuyển đổi totalPrice thành số
    const numericTotalPrice = Array.isArray(totalPrice) ? parseFloat(totalPrice[0]) : parseFloat(totalPrice);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:5000/api/products/${id}`);
                setProduct(response.data as Product);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const formatCurrency = (value: number) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const handlePayment = async () => {
        if (selectedIndex === 0) { // Nếu chọn PayPal
            try {
                const response = await PayPal.paymentRequest({
                    clientId: 'ASAhNybLVOlW4gvMFeUkObE0UV1qLqntaYqAeLjeyz_LcDBlFFDrOgQHl73H7kQHce4Y5GsMgN0Tdga9',
                    environment: 'sandbox',
                    intent: 'sale',
                    price: numericTotalPrice.toString(),
                    currency: 'USD',
                    shortDescription: `Thanh toán cho sản phẩm: ${product?.title}`,
                });
                console.log(id)

                if (response.state === 'approved') {
                    const orderData = {
                        productId: id,
                        userId: user?.id,
                        totalPrice: numericTotalPrice,
                        newsPushDay: selectedDays
                    };

                    await axios.post('http://10.0.2.2:5000/api/orders/thanhtoan', orderData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    showNotification("Thanh toán thành công!", "success");
                } else {
                    showNotification("Thanh toán không thành công!", "error");
                }
            } catch (error) {
                console.error('Error during PayPal payment:', error);
                // showNotification(error || "Có lỗi xảy ra trong quá trình thanh toán.", "error");
            }
        } else {
            showNotification('Chức năng này chưa được hỗ trợ.', "error");
        }
    };

    return (
        <View className="relative w-full h-full bg-white p-4 flex-col">
            <Notification
                message={notifications.message}
                type={notifications.type}
                visible={notifications.visible}
            />
            <View className="flex-row gap-1 border-b-2 border-[#D9D9D9] pb-4">
                <Image
                    style={{ width: 90, height: 90 }}
                    className="rounded-lg"
                    source={require("../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg")}
                />
                <View className="flex-col justify-between">
                    <View>
                        <Text className="font-bold text-[18px]">{product?.title}</Text>
                        <Text className="text-[#9661D9] text-[16px] font-bold">
                            {product?.price !== undefined ? formatCurrency(product.price) : 'Giá không xác định'} đ
                        </Text>
                    </View>
                    <Text className="font-bold text-[16px]">Đẩy tin {selectedDays} ngày</Text>
                </View>
            </View>
            <View
                className="mt-4 mb-4 border-b-2 border-[#D9D9D9]"
                style={{ flex: 1 }}
            >
                <Text className="font-bold text-[18px]">Chọn hình thức thanh toán</Text>
                <View className="mt-4 flex-col gap-4">
                    {choosePayMents.map((item, index) => (
                        <TouchableHighlight
                            key={item.id}
                            underlayColor="#D9D9D9"
                            onPress={() => setSelectedIndex(index)}
                            style={{
                                borderColor: selectedIndex === index ? '#9661D9' : '#808080',
                                backgroundColor: selectedIndex === index ? '#F4E9FF' : '#EFEFEF',
                                borderWidth: 2,
                                borderRadius: 10,
                                padding: 16,
                            }} >
                            <View className="flex-row gap-4 items-center">
                                <Icon name={item.icon} size={26} color={"#000080"} />
                                <Text className="font-bold text-[18px] text-[#9661D9]">{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    ))}
                </View>
            </View>
            <View className="self-end flex-row gap-4 items-center">
                <View className="flex-col">
                    <Text className="font-bold text-[16px] text-[#808080]">
                        Tổng tiền
                    </Text>
                    <Text className="font-bold text-[20px]">{formatCurrency(numericTotalPrice)} đ</Text>
                </View>
                <TouchableHighlight className="rounded-lg" onPress={handlePayment}>
                    <LinearGradient
                        colors={["#523471", "#9C62D7"]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={{
                            paddingTop: 12,
                            paddingBottom: 12,
                            paddingStart: 30,
                            paddingEnd: 30,
                            borderRadius: 14,
                        }}
                    >
                        <View className="flex-row items-center justify-center gap-2">
                            <Text className="font-bold text-[18px] text-[#fff]">
                                Thanh toán
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableHighlight>
            </View>
        </View>
    );
}