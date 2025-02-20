import { Text, View, Image, TouchableHighlight } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link } from "expo-router";
export default function PushNews() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const choosePayMents = [
        { id: 1, icon: "paypal", name: "PayPal" },
        { id: 2, icon: "credit-card", name: "VN Pay" },
    ];
    return (
        <View className="w-full h-full bg-white p-4 flex-col">
            <View className="flex-row gap-1 border-b-2 border-[#D9D9D9] pb-4">
                <Image
                    style={{ width: 90, height: 90 }}
                    className="rounded-lg"
                    source={require("../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg")}
                />
                <View className="flex-col justify-between">
                    <View>
                        <Text className="font-bold text-[18px]">IPhone 16 Pro Max</Text>
                        <Text className="text-[#9661D9] text-[16px] font-bold">
                            9.000.000 đ
                        </Text>
                    </View>
                    <Text className="font-bold text-[16px]">Đẩy tin 1 ngày</Text>
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
                    <Text className="font-bold text-[20px]">28.000 đ</Text>
                </View>
                <TouchableHighlight className="rounded-lg">
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
                            <Link href="/payment"><Text className="font-bold text-[18px] text-[#fff]">
                                Thanh toán
                            </Text></Link> 
                        </View>
                    </LinearGradient>
                </TouchableHighlight>
            </View>
        </View>
    );
}

//npm install react-native-super-grid để sử dụng grid từ react native
