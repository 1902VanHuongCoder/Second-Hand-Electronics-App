import { Text, View, TouchableHighlight, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { logout, updateUser } from '../../store/authSlice';
import { useAuthCheck } from '../../store/checkLogin';
import axios from 'axios';

export default function UserProfile() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [isPhoneHidden, setIsPhoneHidden] = useState(false);
    const router = useRouter();
    const checkAuth = useAuthCheck();
    const handleUpdate = () => {
        if (user) {
            dispatch(updateUser({ id: user.id, name, email, phone, address }));
        } else {
            console.error("User is null");
        }
    };

    const togglePhoneVisibility = async () => {
        try {
            const response = await axios.put('http://10.0.2.2:5000/api/toggle-phone-visibility', {
                userId: user?.id,
            });
            setIsPhoneHidden(response.data.isPhoneHidden)
        } catch (err) {
            console.log('Error: ', err);
        }
    }

    const logoutUser = () => {
        dispatch(logout());
        router.replace('/login');
    }

    useEffect(() => {
        checkAuth();
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone);
            setAddress(user.address);
        }
    }, [user, checkAuth]);
    return (
        <View className='bg-white w-full min-h-screen'>
            <View className='bg-[#9661D9] w-full h-[200px] flex justify-center items-center'>
                <View className='relative'>
                    <Image className='rounded-full border-4 border-[#fff]' style={{ width: 80, height: 80 }} source={user?.avatarUrl ? { uri: user.avatarUrl } : require("../../assets/images/avatar.jpg")} />
                </View>
                <Text className='mt-2 font-bold text-white text-[20px]'>{user?.name ? user.name : 'Chưa cập nhật'}</Text>
                <View className='flex-row gap-2 items-center'>
                    <Icon name="map-marker" size={18} color="#fff" />
                    <Text className='text-white text-[14px] font-semibold'>{user?.address ? user.address : 'Chưa cập nhật'}</Text>
                </View>
            </View>
            <View className='p-4'>
                <View className='flex-col justify-center gap-4'>
                    <View className="flex-row items-center justify-center gap-2">
                        <Link href="/(tabs)/postManagement" className="border-2 border-[#333] px-4 py-3 rounded-lg flex items-center justify-center">
                            <View className="flex-row items-center justify-center gap-2">
                                <Icon name="book" size={22} color="#333" />
                                <Text className="font-bold text-[18px] text-[#333]">Bài đăng</Text>
                            </View>
                        </Link>
                        <Link href="/(tabs)/messageList" className="border-2 border-[#333] px-4 py-3 rounded-lg flex items-center justify-center">
                            <View className="flex-row items-center justify-center gap-2">
                                <Icon name="comments" size={22} color="#333" />
                                <Text className="font-bold text-[18px] text-[#333]">Trò chuyện</Text>
                            </View>
                        </Link>
                    </View>
                    <View className='mt-4'>
                        <Text className='font-extrabold uppercase text-[16px] text-[#333] w-full'>Thông tin cá nhân</Text>
                        <View className='mt-4 flex-row gap-4 items-center justify-between'>
                            <Text className='font-bold text-[16px]'>Email: </Text>
                            <View className='border-2 border-[#D9D9D9] p-2 rounded-lg w-2/3'>
                                <Text className='p-2 text-[14px] font-medium'>{user?.email ? user.email : 'Chưa cập nhật'}</Text>
                            </View>
                        </View>
                        <View className='mt-4 flex-row gap-4 items-center justify-between w-full'>
                            <Text className='font-bold text-[16px]'>Điện thoại: </Text>
                            <View className='border-2 border-[#D9D9D9] p-2 rounded-lg w-2/3 flex-row justify-between items-center'>
                                <Text className='p-2 text-[14px] font-medium'>{isPhoneHidden ? '**********' : user?.phone || 'Chưa cập nhật'}</Text>
                                <TouchableHighlight onPress={togglePhoneVisibility}>
                                    <Icon name={isPhoneHidden ? "eye" : "eye-slash"} size={22} color={'#9C62D7'} />
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View className='mt-4 flex-row gap-4 items-center justify-between w-full'>
                            <Text className='font-bold text-[16px]'>Địa chỉ: </Text>
                            <View className='border-2 border-[#D9D9D9] p-2 w-2/3 rounded-lg flex-row justify-between items-center'>
                                <Text className='p-2 text-[14px] font-medium'>{user?.address ? user.address : 'Chưa cập nhật'}</Text>
                                <Icon name="map-marker" size={18} color="#DC143C" />
                            </View>
                        </View>
                    </View>
                    <View className='mt-6 w-full'>
                        <Link href="/profileSettings" className="rounded-lg">
                            <LinearGradient
                                colors={['#523471', '#9C62D7']}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 0 }}
                                style={{ padding: 10, borderRadius: 8 }}
                            >
                                <View className="flex-row items-center justify-center gap-2 w-full">
                                    <Text className="font-bold text-[18px] text-[#fff] w-full text-center">Cập nhật thông tin</Text>
                                </View>
                            </LinearGradient>
                        </Link>
                    </View>
                    <View>
                        <TouchableHighlight underlayColor="#fff" onPress={logoutUser} className="border-2 border-[#333] w-full py-3 rounded-lg flex items-center justify-center">
                            <View className="flex-row items-center justify-center gap-2">
                                <Icon name="sign-out" size={22} color="#333" />
                                <Text className="font-bold text-[18px] text-[#333]">Đăng xuất</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View >
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flex: 1,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#523471',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});