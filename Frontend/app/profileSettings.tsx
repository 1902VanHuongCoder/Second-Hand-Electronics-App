import { Text, View, SafeAreaView, TextInput, Image, ScrollView, TouchableHighlight } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
// Định nghĩa kiểu cho ảnh và video
interface Media {
    uri: string;
}
export default function ProfileSettings() {
    const [selectedValue, setSelectedValue] = useState("Điện thoại");
    const [images, setImages] = useState<Media[]>([]); // Định nghĩa kiểu cho images
    return (
        <SafeAreaView className='w-full h-full bg-white p-4 flex-1'>
            <ScrollView>
                <View className='flex-col gap-3'>
                    <Text className='uppercase font-bold text-[16px] mb-4'>Thông tin cá nhân</Text>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Họ tên<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='Nguyễn văn A' />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Địa chỉ<Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="Địa chỉ của bạn" value="Địa chỉ của bạn" />
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Số điện thoại<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='0xx-xxx-xxxx' />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Email<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='test@gmail.com' />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Mật khẩu</Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='............' />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Nhập lại mật khẩu</Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='............' />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Ảnh đại diện</Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg p-3 flex-col items-center'>
                            <Text className='text-[#9661D9] font-semibold self-end'>Hình ảnh hợp lệ</Text>
                            <Icon name='camera' size={40} color='#9661D9' />
                            <TouchableHighlight
                                onPress={() => { }}
                                underlayColor="#DDDDDD"
                                style={{ padding: 10, alignItems: 'center' }}
                            >
                                <Text className='font-bold uppercase'>Cập nhật ảnh đại diện tại đây</Text>
                            </TouchableHighlight>
                            <ScrollView horizontal>
                                {images.map((image, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: image.uri }}
                                        style={{ width: 100, height: 100, margin: 5 }}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                    <View className='mt-6 self-end'>
                        <TouchableHighlight className="rounded-lg">
                            <LinearGradient
                                colors={['#523471', '#9C62D7']}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 0 }}
                                style={{ paddingTop: 12, paddingBottom: 12, paddingStart: 30, paddingEnd: 30, borderRadius: 8 }}
                            >
                                <View className="flex-row items-center justify-center gap-2">
                                    <Text className="font-bold text-[18px] text-[#fff]">Cập nhật</Text>
                                </View>
                            </LinearGradient>
                        </TouchableHighlight>
                    </View >
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}