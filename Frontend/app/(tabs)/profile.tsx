import { Text, View, TouchableHighlight, Image, TextInput } from 'react-native'
import React, { Component } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from "react-native-vector-icons/FontAwesome";
export default function profile() {
    return (
        <View className='bg-white w-full min-h-screen'>
            <View className='bg-[#9661D9] w-full h-[200px] flex justify-center items-center'>
                <View className='relative'>
                    <Image className='rounded-full' style={{ width: 70, height: 70 }} source={require('../../assets/images/z6186705977978_00edd678a64db50dba5ef61a50391611.jpg')} />
                    <View className='absolute bottom-0 -right-1 bg-white p-2 rounded-full'>
                        <Icon name='camera' size={14} color={'#333'} />
                    </View>
                </View>
                <Text className='mt-2 font-bold text-white text-[20px]'>Lê Hữu Hoàng Anh</Text>
                <View className='flex-row gap-2 items-center'>
                    <Icon name="map-marker" size={18} color="#fff" />
                    <Text className='text-white text-[14px] font-semibold'>Tân Phú - Long Mỹ - Hậu Giang</Text>
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
                            <Text className='p-2 text-[14px] font-medium'>lehuuhoanganhhg2003@gmail.com</Text>
                        </View>
                    </View>
                    <View className='mt-4 flex-row gap-4 items-center justify-between w-full'>
                        <Text className='font-bold text-[16px]'>Điện thoại: </Text>
                        <View className='border-2 border-[#D9D9D9] p-2 rounded-lg w-2/3'>
                            <Text className='p-2 text-[14px] font-medium'>033.333.3333</Text>
                        </View>
                    </View>
                    <View className='mt-4 flex-row gap-4 items-center justify-between w-full'>
                        <Text className='font-bold text-[16px]'>Địa chỉ: </Text>
                        <View className='border-2 border-[#D9D9D9] p-2 w-2/3 rounded-lg flex-row justify-between items-center'>
                            <Text className='p-2 text-[14px] font-medium'>Tân Phú - Long Mỹ - Hậu Giang</Text>
                            <Icon name="map-marker" size={18} color="#DC143C" />
                        </View>
                    </View>
                </View>
                <View className='mt-6'>
                    <TouchableHighlight className="rounded-lg">
                        <LinearGradient
                            colors={[ '#523471', '#9C62D7']}
                            start={{ x: 1, y: 0 }} 
                            end={{ x: 0, y: 0 }}
                            style={{ padding: 10, borderRadius: 8 }}
                        >
                            <View className="flex-row items-center justify-center gap-2">
                                <Text className="font-bold text-[18px] text-[#fff]">Cập nhật thông tin</Text>
                            </View>
                        </LinearGradient>
                    </TouchableHighlight>
                </View >
                <View className='mt-8'>
                    <TouchableHighlight className="border-2 border-[#333] px-4 py-3 rounded-lg flex items-center justify-center">
                        <View className="flex-row items-center justify-center gap-2">
                            <Icon name="sign-out" size={22} color="#333" />
                            <Text className="font-bold text-[18px] text-[#333]">Đăng xuất</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    );
}