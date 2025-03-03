import { ScrollView, Text, TouchableHighlight, View, Image } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from "expo-router";
import { useAuthCheck } from '../../store/checkLogin';
interface Product {
    id: string;
    name: string;
    price: number;
    postingDate: string;
    expirationDate: string;
    views: number;
    image: string;
    type: string;
    brandName: string;
    status: string;
    address: string;
}

export default function PostManagement() {
    const checkAuth = useAuthCheck();
    const [products, setProducts] = useState<Product[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    useEffect(() => {
        checkAuth();
        const fetchUserPosts = async () => {
            try {
                if (user) {
                    console.log("hello");

                    const response = await axios.get<Product[]>(`http://10.0.2.2:5000/api/post-management/user/${user.id}`);
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        }
        fetchUserPosts();
    }, [user]);

    return (
        <View className='w-full h-full bg-white'>
            <ScrollView>
                {products.map(product => (
                    <View key={product.id} className='flex-col gap-4 border-b-2 border-[#D9D9D9] pb-6'>
                        <Image
                            style={{ width: '100%', height: 250 }}
                            source={require("../../assets/images/dsc02537.jpg")}
                        />
                        <View className='flex-col gap-1 px-4'>
                            <Text className='font-bold text-[20px]'>{product.name}</Text>
                            <Text className='text-[#9661D9] font-bold text-[18px]'>{product.price.toLocaleString('vi-VN')} đ</Text>
                            <Text className='font-medium text-[14px]'>Loại: <Text className='font-bold'>{product.type}</Text></Text>
                            <Text className='font-medium text-[14px]'>Thương hiệu: <Text className='font-bold'>{product.brandName}</Text></Text>
                            <Text className='font-medium text-[14px]'>Ngày đăng: <Text className='font-bold'>{new Date(product.postingDate).toLocaleDateString('vi-VN')}</Text></Text>
                            <Text className='font-medium text-[14px]'>Trạng thái: <Text className='font-bold'>{product.status}</Text></Text>
                            <Text className='font-medium text-[14px]'>Lượt xem: <Text className='font-bold'>{product.views}</Text></Text>
                        </View>
                        <View className='px-6 flex-row w-full gap-4 mx-auto items-center justify-center'>
                            <TouchableHighlight 
                                className='border-2 w-[20%] rounded-md p-3 border-[#808080]'
                                onPress={() => router.push(`/postCreation?id=${product.id}`)}
                            >
                                <View className='flex-row items-center justify-center gap-2'>
                                    <Icon name='pencil' size={22} color={'#808080'} />
                                    <Text className='font-bold text-[#808080] text-[16px]'>Sửa</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight className='border-2 w-[40%] rounded-md p-3 border-[#9661D9]'>
                                <View className='flex-row items-center justify-center gap-2'>
                                    <Icon name='arrow-circle-up' size={22} color={'#9661D9'} />
                                    <Link href={`/publishPost?id=${product.id}`}> <Text className='font-bold text-[#9661D9] text-[16px]'>Đẩy tin</Text></Link>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight className='rounded-md h-full w-[40%]'>
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