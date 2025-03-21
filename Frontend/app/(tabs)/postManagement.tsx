import { ScrollView, Text, TouchableHighlight, View, Image } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome';
import Notification from "@/components/Notification";
import { NotificationContext } from "@/context/NotificationContext";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter, Link } from "expo-router";
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
    isHidden: boolean;
}

export default function PostManagement() {
    const checkAuth = useAuthCheck();
    const [products, setProducts] = useState<Product[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('Đang hiển thị');
    const { notifications, showNotification } = useContext(NotificationContext);
    useEffect(() => {
        checkAuth();
        const fetchUserPosts = async () => {
            try {
                if (user) {
                    const response = await axios.get<Product[]>(`http://10.0.2.2:5000/api/post-management/user/${user.id}`);
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        }
        fetchUserPosts();
    }, [user]);

    const toggleHiddenPosts = async (id: string) => {
        try {
            const response = await axios.patch(`http://10.0.2.2:5000/api/products/hiddenPost/${id}`, { reason: "" });

            // Cập nhật danh sách sản phẩm sau khi thay đổi trạng thái
            setProducts(products.map(product =>
                product.id === id ? { ...product, isHidden: response.data.isHidden } : product
            ));

            showNotification(response.data.isHidden ? 'Đã ẩn tin' : 'Tin đã hiển thị lại', 'success');
        } catch (err) {
            showNotification(err || "Có lỗi xảy ra", 'error');
        }
    };

    const filteredProducts = products.filter(product => {
        const today = new Date();
        const expiration = new Date(product.expirationDate);

        if (selectedTab === 'Đang hiển thị') return !product.isHidden && expiration >= today;
        if (selectedTab === 'Tin đã ẩn') return product.isHidden;
        if (selectedTab === 'Tin hết hạn') return expiration < today;
        return true;
    });


    return (
        <View className='w-full h-full bg-white'>
            <Notification
                message={notifications.message}
                type={notifications.type}
                visible={notifications.visible}
            />
            <ScrollView className='mt-6 px-4 pb-8 border-[#D9D9D9]'>
                <View className='flex-row gap-10 items-center justify-center'>
                    {['Đang hiển thị', 'Tin đã ẩn', 'Tin hết hạn'].map((tab, index) => (
                        <TouchableHighlight
                            key={index}
                            underlayColor="#D9D9D9"
                            onPress={() => setSelectedTab(tab)}
                        >
                            <Text className={`font-bold text-[16px] ${selectedTab === tab ? 'text-[#9661D9]' : 'text-black'}`}>
                                {tab}
                            </Text>
                        </TouchableHighlight>
                    ))}
                </View>
            </ScrollView>
            {filteredProducts.length > 0 ? (
                <ScrollView>
                    {filteredProducts.map(product => (
                        <View key={product.id} className='flex-col gap-4 border-b-2 border-[#D9D9D9] pb-6'>
                            <Image
                                style={{ width: '100%', height: 400 }}
                                source={{ uri: product.image }}
                            />
                            <View className='flex-col gap-1 px-4'>
                                <Text className='font-bold text-[20px]'>{product.name}</Text>
                                <Text className='text-[#9661D9] font-bold text-[18px]'>{product.price.toLocaleString('vi-VN')} đ</Text>
                                <Text className='font-medium text-[14px]'>Loại: <Text className='font-bold'>{product.type}</Text></Text>
                                <Text className='font-medium text-[14px]'>Thương hiệu: <Text className='font-bold'>{product.brandName}</Text></Text>
                                <Text className='font-medium text-[14px]'>Ngày đăng: <Text className='font-bold'>{new Date(product.postingDate).toLocaleDateString('vi-VN')}</Text></Text>
                                <Text className='font-medium text-[14px]'>Ngày hết hạn: <Text className='font-bold'>{new Date(product.expirationDate).toLocaleDateString('vi-VN')}</Text></Text>
                                <Text className='font-medium text-[14px]'>Trạng thái: <Text className='font-bold'>{product.status}</Text></Text>
                            </View>
                            <View className={`${new Date(product.expirationDate) < new Date() ? 'hidden' : 'flex-row px-4 items-center justify-center gap-4'}`}>
                                <TouchableHighlight
                                    className="border-2 rounded-md p-3 border-[#808080]"
                                    onPress={() => router.push(`/postCreation?id=${product.id}`)}
                                >
                                    <View className="flex-row items-center justify-center gap-2">
                                        <Icon name="pencil" size={22} color={'#808080'} />
                                        <Text className="font-bold text-[#808080] text-[16px]">Sửa</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight className="border-2 flex-1 rounded-md p-3 border-[#9661D9]">
                                    <View className="flex-row items-center justify-center gap-2">
                                        <Icon name="arrow-circle-up" size={22} color={'#9661D9'} />
                                        <Link href={`/publishPost?id=${product.id}`}>
                                            <Text className="font-bold text-[#9661D9] text-[16px]">Đẩy tin</Text>
                                        </Link>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight className={`${product.isHidden ? 'hidden' : 'rounded-md flex-1 h-full'}`}>
                                    <LinearGradient
                                        colors={['#523471', '#9C62D7']}
                                        start={{ x: 1, y: 0 }}
                                        end={{ x: 0, y: 0 }}
                                        style={{ padding: 12, borderRadius: 6 }}
                                    >
                                        <View className="flex-row items-center justify-center gap-2 w-full">
                                            <Icon name="eye-slash" size={22} color={'#fff'} />
                                            <Link href={`/hiddenPosts?id=${product.id}`}>
                                                <Text className="font-bold text-[16px] text-[#fff]">
                                                    Ẩn tin
                                                </Text>
                                            </Link>
                                        </View>
                                    </LinearGradient>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => toggleHiddenPosts(product.id)} className={`${product.isHidden ? 'block rounded-md flex-1 h-full' : 'hidden'}`}>
                                    <LinearGradient
                                        colors={['#523471', '#9C62D7']}
                                        start={{ x: 1, y: 0 }}
                                        end={{ x: 0, y: 0 }}
                                        style={{ padding: 12, borderRadius: 6 }}
                                    >
                                        <View className="flex-row items-center justify-center gap-2 w-full">
                                            <Text className="font-bold text-[16px] text-[#fff]">
                                                Hiển thị
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableHighlight>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View className="flex-1 items-center">
                    <Text className="text-gray-500 text-[16px] font-bold">
                        Không có kết quả phù hợp
                    </Text>
                    <Image className="w-48 h-48" source={require('../../assets/images/cute-shiba-inu-dog-sleeping-with-coffee-blanket-cartoon-vector-icon-illustration-animal-nature.png')} />
                </View>
            )}
        </View>
    );
}