import { Text, View, Image, TouchableHighlight } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FlatGrid } from 'react-native-super-grid';
import { LinearGradient } from "expo-linear-gradient";
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

interface Product {
    id: string;
    title: string;
    price: number;
    images: String;
}
export default function PublishPost() {
    const [product, setProduct] = useState<Product | null>(null);
    const { id } = useLocalSearchParams();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [totalPrice, setToTalPrice] = useState(0);
    const [selectedDays, setSelectedDays] = useState(0);
    const choosePrices = [
        { day: 1, price: 28000 },
        { day: 2, price: 56000 },
        { day: 3, price: 84000 },
        { day: 5, price: 140000 },
        { day: 7, price: 196000 },
    ]

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

    const handlePriceSelection = (index: number) => {
        setSelectedIndex(index);
        setToTalPrice(choosePrices[index].price);
        setSelectedDays(choosePrices[index].day);
    }

    const formatCurrency = (value: number) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return (
        <View className='w-full h-full bg-white p-4 flex-col'>
            <View className="flex-row gap-1 border-b-2 border-[#D9D9D9] pb-4">
                <Image
                    style={{ width: 90, height: 90 }}
                    className="rounded-lg"
                    source={require("../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg")}
                />
                <View>
                    <Text className="font-bold text-[18px]">{product?.title}</Text>
                    <Text className="text-[#9661D9] text-[16px] font-bold">{product?.price !== undefined ? formatCurrency(product.price) : 'Giá không xác định'} đ</Text>
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
                            onPress={() => handlePriceSelection(index)}
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
                                <Text className='font-bold text-[16px] mb-1'>{item.day} Ngày</Text>
                                <Text className='font-semibold text-[#9661D9]'>{formatCurrency(item.price)} đ</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
            <View className='self-end flex-row gap-4 items-center'>
                <View className='flex-col'>
                    <Text className='font-bold text-[16px] text-[#808080]'>Tổng tiền</Text>
                    <Text className='font-bold text-[20px]'>{formatCurrency(totalPrice)} đ</Text>
                </View>
                <TouchableHighlight className="rounded-lg">
                    <LinearGradient
                        colors={['#523471', '#9C62D7']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={{ paddingTop: 12, paddingBottom: 12, paddingStart: 30, paddingEnd: 30, borderRadius: 14 }}
                    >
                        <View className="flex-row items-center justify-center gap-2">
                            <Link
                                href={{
                                    pathname: "/payment",
                                    params: { id, totalPrice, selectedDays } // Truyền id sản phẩm, tổng tiền và số ngày đã chọn
                                }}
                            ><Text className="font-bold text-[18px] text-[#fff]">Thanh toán</Text></Link>
                        </View>
                    </LinearGradient>
                </TouchableHighlight>
            </View>
        </View>
    );
}

//npm install react-native-super-grid để sử dụng grid từ react native