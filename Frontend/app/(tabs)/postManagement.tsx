import { ScrollView, Text, TouchableHighlight, View, Image } from 'react-native'
import React, { Component } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';

export default function PostManagement() {
    const products = [
        {
            id: "1",
            name: "Laptop Acer Aspire 3 Spin A3SP14",
            price: "9.000.000 đ",
            postingDate: "12/02/2024",
            expirationDate: '12/02/2024',
            image:
                "../../assets/images/dsc02537.jpg",
            views: '300'
        },
        {
            id: "2",
            name: "Laptop Acer Aspire 3 Spin A3SP14",
            price: "9.000.000 đ",
            postingDate: "12/02/2024",
            expirationDate: '12/02/2024',
            image:
                "../../assets/images/dsc02537.jpg",
            views: '300'
        },
    ];
    return (
        <View className='w-full h-full bg-white'>
            <ScrollView>
                {products.map(product => (
                    <View key={product.id} className='flex-col gap-4 border-b-2 border-[#D9D9D9] pb-6'>
                        <Image style={{ width: '100%', height: 250 }} source={require("../../assets/images/dsc02537.jpg")} />
                        <View className='flex-col gap-1 px-4'>
                            <Text className='font-bold text-[20px]'>{product.name}</Text>
                            <Text className='text-[#9661D9] font-bold text-[18px]'>{product.price}</Text>
                            <Text className='font-medium text-[14px]'>Ngày đăng: <Text className='font-bold'>{product.postingDate}</Text></Text>
                            <Text className='font-medium text-[14px]'>Ngày hết hạn: <Text className='font-bold'>{product.expirationDate}</Text></Text>
                            <Text className='font-medium text-[14px]'>Lượt xem: <Text className='font-bold'>{product.views}</Text></Text>
                        </View>
                        <View className='px-6 flex-row w-full gap-4 mx-auto items-center justify-center'>
                            <TouchableHighlight className='border-2 w-1/2 rounded-md p-3 border-[#9661D9]'>
                                <View className='flex-row items-center justify-center gap-2'>
                                    <Icon name='arrow-circle-up' size={22} color={'#9661D9'} />
                                  <Link href="/publishPost"> <Text className='font-bold text-[#9661D9] text-[16px]'>Đẩy tin</Text></Link> 
                                </View>
                            </TouchableHighlight>   
                            <TouchableHighlight className='rounded-md h-full w-1/2'>
                                <LinearGradient
                                    colors={['#523471', '#9C62D7']}
                                    start={{ x: 1, y: 0 }}
                                    end={{ x: 0, y: 0 }}
                                    style={{ padding: 12, borderRadius: 6 }}
                                >
                                    <View className="flex-row items-center justify-center gap-2">
                                        <Icon name='eye-slash' size={22} color={'#fff'} />
                                        <Text className="font-bold text-[16px] text-[#fff]">Ẩn tin</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableHighlight>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}