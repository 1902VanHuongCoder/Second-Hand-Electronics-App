import { Text, View, TouchableHighlight, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updateUser } from '../../store/authSlice';
import { RootState } from '../../store/store';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { logout } from '../../store/authSlice';
import { useRouter } from "expo-router";

export default function UserProfile() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const router = useRouter();
    const handleUpdate = () => {
        if (user) {
            dispatch(updateUser({ id: user.id, name, email, phone, address }));
        } else {
            console.error("User is null");
        }
    };

    const logoutUser = () => {
        dispatch(logout());
        router.push('/login');
    }

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone);
            setAddress(user.address);
        }
    }, [user]);
    console.log(user);
    return (
        <View className='bg-white w-full min-h-screen'>
            <View className='bg-[#9661D9] w-full h-[200px] flex justify-center items-center'>
                <View className='relative'>
                    <Image className='rounded-full border-4 border-[#fff]' style={{ width: 80, height: 80 }} source={require('../../assets/images/z6186705977978_00edd678a64db50dba5ef61a50391611.jpg')} />
                    <View className='absolute bottom-0 -right-1 bg-white p-2 rounded-full'>
                        <Icon name='camera' size={14} color={'#333'} />
                    </View>
                </View>
                <Text className='mt-2 font-bold text-white text-[20px]'>{user?.name ? user.name : 'Chưa cập nhật'}</Text>
                <View className='flex-row gap-2 items-center'>
                    <Icon name="map-marker" size={18} color="#fff" />
                    <Text className='text-white text-[14px] font-semibold'>{user?.address ? user.address : 'Chưa cập nhật'}</Text>
                </View>
            </View>
            <View className='p-4'>
                <View className='flex-row items-center justify-center gap-4'>
                    <TouchableHighlight className="border-2 border-[#333] px-4 py-3 rounded-lg flex items-center justify-center">
                        <View className="flex-row items-center justify-center gap-2">
                            <Icon name="book" size={22} color="#333" />
                            <Text className="font-bold text-[18px] text-[#333]">Bài đăng</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight className="border-2 border-[#333] px-4 py-3 rounded-lg flex items-center justify-center">
                        <View className="flex-row items-center justify-center gap-2">
                            <Icon name="comments" size={22} color="#333" />
                            <Text className="font-bold text-[18px] text-[#333]">Trò chuyện</Text>
                        </View>
                    </TouchableHighlight>
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
                        <View className='border-2 border-[#D9D9D9] p-2 rounded-lg w-2/3'>
                            <Text className='p-2 text-[14px] font-medium'>{user?.phone ? user.phone : 'Chưa cập nhật'}</Text>
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
                <View className='mb-4 mt-6 w-full'>
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
                    <TouchableHighlight onPress={logoutUser} className="border-2 border-[#333] w-full py-3 rounded-lg flex items-center justify-center">
                        <View className="flex-row items-center justify-center gap-2">
                            <Icon name="sign-out" size={22} color="#333" />
                            <Text className="font-bold text-[18px] text-[#333]">Đăng xuất</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        </View >
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