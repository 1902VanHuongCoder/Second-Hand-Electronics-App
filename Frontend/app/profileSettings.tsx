import { Text, View, SafeAreaView, TextInput, Image, Button, ScrollView, TouchableHighlight, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@/store/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_URL = "http://10.0.2.2:5000/api/upload";

export default function ProfileSettings() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [selectedValue, setSelectedValue] = useState(user?.address || '');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl || '');

    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Update user profile information
    const handleUpdate = () => {
        if (user) {
            dispatch(updateUser({ id: user.id, name, email, phone, address, avatarUrl })).then(() => {
                router.push('/userProfile'); // Navigate to userProfile after successful update
            });
        } else {
            console.error("User is null");
        }
    };

    // Select image from gallery and set it to the state variable
    const selectImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Quyền truy cập thư viện ảnh bị từ chối");
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setAvatarUrl(null);
        }
    };

    // Upload image to the server and set the avatarUrl to the returned URL
    const uploadImage = async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: "avatar.jpg",
      } as any);
  
      try {
        const response = await axios.post<{ url: string,success: boolean, message: string  }>(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        setAvatarUrl(response.data.url); 
        setImage(null);
    
      } catch (error) {
        console.error("Upload Error:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone);
            setAddress(user.address);
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [user]);

    return (
        <SafeAreaView className='w-full h-full bg-white p-4 flex-1'>
            <ScrollView>
                <View className='flex-col gap-3'>
                    <Text className='uppercase font-bold text-[16px] mb-4'>Thông tin cá nhân</Text>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Họ tên<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='Nguyễn văn A'
                            value={name}
                            onChangeText={setName}
                        />
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
                            placeholder='0xx-xxx-xxxx'
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Email<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='test@gmail.com'
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Mật khẩu</Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='............'
                        />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Nhập lại mật khẩu</Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='............'
                        />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Ảnh đại diện</Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg p-3 flex-col items-center'>
                            <Text className='text-[#9661D9] font-semibold self-end'>Hình ảnh hợp lệ</Text>
                            {!avatarUrl && !image && <Icon name='camera' size={40} color='#9661D9' />}
                            {/* <TouchableHighlight
                                onPress={pickImage}
                                underlayColor="#DDDDDD"
                                style={{ padding: 10, alignItems: 'center' }}
                            >
                                <Text className='font-bold uppercase'>Cập nhật ảnh đại diện tại đây</Text>
                            </TouchableHighlight> */}
                            {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50, margin: 10 }} />}
                            {avatarUrl && <Image source={{ uri: avatarUrl }} style={{ width: 100, height: 100, borderRadius: 50, margin: 10 }} />}
                            {loading &&<ActivityIndicator size="large" color="blue" />}
                            {image && <Button title="Tải ảnh lên" onPress={uploadImage} />}
                            {!image && <Button title="Chọn ảnh" onPress={selectImage} />}
                        </View>
                    </View>
                    <View className='mt-6 self-end'>
                        <TouchableHighlight className="rounded-lg" onPress={handleUpdate}>
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




