import { Text, View, Image, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { FlatGrid } from 'react-native-super-grid';
import { LinearGradient } from "expo-linear-gradient";
import { Link } from 'expo-router';

export default function PublishPost() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const choosePrices = [
        { day: '1 Ngày', price: '28.000 đ' },
        { day: '2 Ngày', price: '56.000 đ' },
        { day: '3 Ngày', price: '84.000 đ' },
        { day: '5 Ngày', price: '140.000 đ' },
        { day: '7 Ngày', price: '196.000 đ' },
    ]
    return (
        <View className='w-full h-full bg-white p-4 flex-col'>
            <View className="flex-row gap-1 border-b-2 border-[#D9D9D9] pb-4">
                <Image
                    style={{ width: 90, height: 90 }}
                    className="rounded-lg"
                    source={require("../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg")}
                />
                <View>
                    <Text className="font-bold text-[18px]">IPhone 16 Pro Max</Text>
                    <Text className="text-[#9661D9] text-[16px] font-bold">9.000.000 đ</Text>
                </View>
            </View>
            <View className='mt-4 mb-4 border-b-2 border-[#D9D9D9]' style={{ flex: 1 }}>
                <Text className='font-bold text-[18px]'>Ưu tiên vị trí hiển thị</Text>
                <Text className='mt-1 font-semibold text-[#808080] text-[16px]'>Gia tăng lợi thế, ưu tiên các vị trí đầu trên trang tìm kiếm.</Text>
                <FlatGrid
                    itemDimension={130} // Kích thước của mỗi ô
                    data={choosePrices}
                    renderItem={({ item, index }) => (
                        <TouchableHighlight
                            key={index}
                            underlayColor="#D9D9D9" // Chỉ định màu nền khi nhấn
                            onPress={() => setSelectedIndex(index)}
                            style={{
                                borderColor: selectedIndex === index ? '#9661D9' : '#808080',
                                backgroundColor: selectedIndex === index ? '#F4E9FF' : '#EFEFEF',
                                borderWidth: 2,
                                borderRadius: 10,
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <View>
                                <Text className='font-bold text-[16px] mb-1'>{item.day}</Text>
                                <Text className='font-semibold text-[#9661D9]'>{item.price}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
            <View className='self-end flex-row gap-4 items-center'>
                <View className='flex-col'>
                    <Text className='font-bold text-[16px] text-[#808080]'>Tổng tiền</Text>
                    <Text className='font-bold text-[20px]'>28.000 đ</Text>
                </View>
                <TouchableHighlight className="rounded-lg">
                    <LinearGradient
                        colors={['#523471', '#9C62D7']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={{ paddingTop: 12, paddingBottom: 12, paddingStart: 30, paddingEnd: 30, borderRadius: 14 }}
                    >
                        <View className="flex-row items-center justify-center gap-2">
                                <Link href="/payment"><Text className="font-bold text-[18px] text-[#fff]">Thanh toán</Text></Link>
                        </View>
                    </LinearGradient>
                </TouchableHighlight>
            </View>
        </View>
    );
}

//npm install react-native-super-grid để sử dụng grid từ react native