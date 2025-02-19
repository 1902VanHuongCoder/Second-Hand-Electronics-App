import { Text, View, ScrollView, TextInput, TouchableHighlight, Button, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";

// Định nghĩa kiểu cho ảnh và video
interface Media {
    uri: string;
}
export default function PostNews() {
    const [selectedValue, setSelectedValue] = useState("Điện thoại");
    const [images, setImages] = useState<Media[]>([]); // Định nghĩa kiểu cho images
    const [videos, setVideos] = useState<Media[]>([]); // Định nghĩa kiểu cho videos
    const colors = [
        { id: '1', label: 'Đen', value: 'Đen' },
        { id: '2', label: 'Đỏ', value: 'Đỏ' },
        { id: '3', label: 'Cam', value: 'Cam' },
        { id: '4', label: 'Xanh dương', value: 'Xanh dương' },
        { id: '5', label: 'Xanh lá', value: 'Xanh lá' },
        { id: '6', label: 'Vàng', value: 'Vàng' },
        { id: '7', label: 'Tím', value: 'Tím' },
        { id: '8', label: 'Trắng', value: 'Trắng' },
        { id: '9', label: 'Xám', value: 'Xám' },
        { id: '10', label: 'Nâu', value: 'Nâu' },
        { id: '11', label: 'Hồng', value: 'Hồng' },
        { id: '12', label: 'Xanh ngọc', value: 'Xanh ngọc' },
        { id: '13', label: 'Xanh da trời', value: 'Xanh da trời' },
        { id: '14', label: 'Vàng chanh', value: 'Vàng chanh' },
        { id: '15', label: 'Đỏ tươi', value: 'Đỏ tươi' },
        { id: '16', label: 'Xanh lá cây', value: 'Xanh lá cây' },
        { id: '17', label: 'Xanh lục', value: 'Xanh lục' },
        { id: '18', label: 'Xanh dương nhạt', value: 'Xanh dương nhạt' },
        { id: '19', label: 'Xanh dương đậm', value: 'Xanh dương đậm' },
        { id: '20', label: 'Đỏ nhạt', value: 'Đỏ nhạt' },
    ];
    const brands = [
        { id: '1', label: 'Apple', value: 'Apple' },
        { id: '2', label: 'Samsung', value: 'Samsung' },
        { id: '3', label: 'Xiaomi', value: 'Xiaomi' },
        { id: '4', label: 'Oppo', value: 'Oppo' },
        { id: '5', label: 'Vivo', value: 'Vivo' },
        { id: '6', label: 'Nokia', value: 'Nokia' },
        { id: '7', label: 'Sony', value: 'Sony' },
        { id: '8', label: 'Huawei', value: 'Huawei' },
        { id: '9', label: 'LG', value: 'Lg' },
        { id: '10', label: 'OnePlus', value: 'Oneplus' },
        { id: '11', label: 'Realme', value: 'Realme' },
        { id: '12', label: 'Google', value: 'Google' },
    ];
    const storageOptions = [
        { id: '1', label: '< 8 GB', value: '< 8 GB' },
        { id: '2', label: '8 GB', value: '8 GB' },
        { id: '3', label: '16 GB', value: '16 GB' },
        { id: '4', label: '32 GB', value: '32 GB' },
        { id: '5', label: '64 GB', value: '64 GB' },
        { id: '6', label: '128 GB', value: '128 GB' },
        { id: '7', label: '256 GB', value: '256 GB' },
        { id: '8', label: '512 GB', value: '512 GB' },
        { id: '9', label: '1 TB', value: '1 TB' },
    ];
    const laptopBrands = [
        { id: '1', label: 'Apple', value: 'Apple' },
        { id: '2', label: 'Dell', value: 'Dell' },
        { id: '3', label: 'HP', value: 'HP' },
        { id: '4', label: 'Lenovo', value: 'Lenovo' },
        { id: '5', label: 'Asus', value: 'Asus' },
        { id: '6', label: 'Acer', value: 'Acer' },
        { id: '7', label: 'Microsoft', value: 'Microsoft' },
        { id: '8', label: 'Razer', value: 'Razer' },
        { id: '9', label: 'Samsung', value: 'Samsung' },
        { id: '10', label: 'Toshiba', value: 'Toshiba' },
    ];
    const processors = [
        { id: '1', label: 'Intel Core i3', value: 'Intel Core i3' },
        { id: '2', label: 'Intel Core i5', value: 'Intel Core i5' },
        { id: '3', label: 'Intel Core i7', value: 'Intel Core i7' },
        { id: '4', label: 'Intel Core i9', value: 'Intel Core i9' },
        { id: '5', label: 'AMD Ryzen 3', value: 'AMD Ryzen 3' },
        { id: '6', label: 'AMD Ryzen 5', value: 'AMD Ryzen 5' },
        { id: '7', label: 'AMD Ryzen 7', value: 'AMD Ryzen 7' },
        { id: '8', label: 'AMD Ryzen 9', value: 'AMD Ryzen 9' },
        { id: '9', label: 'Apple M1', value: 'Apple M1' },
        { id: '10', label: 'Apple M1 Pro', value: 'Apple M1 Pro' },
        { id: '11', label: 'Apple M1 Max', value: 'Apple M1 Max' },
    ];
    const ramOptions = [
        { id: '1', label: '4 GB', value: '4 GB' },
        { id: '2', label: '8 GB', value: '8 GB' },
        { id: '3', label: '16 GB', value: '16 GB' },
        { id: '4', label: '32 GB', value: '32 GB' },
        { id: '5', label: '> 32 GB', value: '> 32 GB' },
    ];
    const storageLaptopOptions = [
        { id: '1', label: '128 GB', value: '128 GB' },
        { id: '2', label: '256 GB', value: '256 GB' },
        { id: '3', label: '512 GB', value: '512 GB' },
        { id: '4', label: '1 TB', value: '1 TB' },
    ];
    const screenSizes = [
        { id: '1', label: '13.3 inch', value: '13.3 inch' },
        { id: '2', label: '14 inch', value: '14 inch' },
        { id: '3', label: '15.6 inch', value: '15.6 inch' },
        { id: '4', label: '17.3 inch', value: '17.3 inch' },
        { id: '5', label: '11.6 inch', value: '11.6 inch' },
    ];

    return (
        <View className='w-full h-full bg-white p-4'>
            <ScrollView>
                <View className='flex-col gap-5'>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Danh mục <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="Điện thoại" value="Điện thoại" />
                                <Picker.Item label="Laptop" value="Laptop" />
                            </Picker>
                        </View>
                    </View>
                    <Text className='font-bold text-[16px] uppercase'>Thông tin chi tiết</Text>
                    <View className='flex-col gap-2'>
                        <View className='border-2 border-[#D9D9D9] rounded-lg p-3 flex-col items-center'>
                            <Text className='text-[#9661D9] font-semibold self-end'>Hình ảnh hợp lệ</Text>
                            <Icon name='camera' size={40} color='#9661D9' />
                            <TouchableHighlight
                                onPress={() => {}}
                                underlayColor="#DDDDDD"
                                style={{ padding: 10, alignItems: 'center' }}
                            >
                                <Text className='font-bold uppercase'>Đăng từ 01 đến 06 hình</Text>
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
                    <View className='flex-col gap-2'>
                        <View className='border-2 border-[#D9D9D9] rounded-lg p-3 flex-col items-center'>
                            <Icon className='mt-4' name='video-camera' size={40} color='#9661D9' />
                            <TouchableHighlight
                                onPress={() => {}}
                                underlayColor="#DDDDDD"
                                style={{ padding: 10, alignItems: 'center' }}
                            >
                                <Text className='font-bold uppercase'>Đăng tối đa 01 video sản phẩm</Text>
                            </TouchableHighlight>
                            <ScrollView horizontal>
                                {videos.map((video, index) => (
                                    <Text key={index} style={{ margin: 5 }}>
                                        {video.uri ? video.uri.split('/').pop() : 'Video chưa chọn'} {/* Hiển thị tên video */}
                                    </Text>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Tình trạng <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="Mới" value="Mới" />
                                <Picker.Item label="Đã sử dụng ( Chưa sửa chữa )" value="Đã sử dụng ( Chưa sửa chữa )" />
                                <Picker.Item label="Đã sử dụng ( Sửa nhiều lần )" value="Đã sử dụng ( Sửa nhiều lần )" />
                            </Picker>
                        </View>
                    </View>
                    {/* <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Hãng <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                {brands.map(brand => (
                                    <Picker.Item key={brand.id} label={brand.label} value={brand.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Màu sắc <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                {colors.map(color => (
                                    <Picker.Item key={color.id} label={color.label} value={color.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Dung lượng <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                {storageOptions.map(storageOption => (
                                    <Picker.Item key={storageOption.id} label={storageOption.label} value={storageOption.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>*/}
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Hãng <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                {laptopBrands.map(laptopBrand => (
                                    <Picker.Item key={laptopBrand.id} label={laptopBrand.label} value={laptopBrand.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Bộ vi xử lý <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                {processors.map(processor => (
                                    <Picker.Item key={processor.id} label={processor.label} value={processor.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Ram <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                {ramOptions.map(ramOption => (
                                    <Picker.Item key={ramOption.id} label={ramOption.label} value={ramOption.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Ổ cứng <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                {storageLaptopOptions.map(storageLaptopOption => (
                                    <Picker.Item key={storageLaptopOption.id} label={storageLaptopOption.label} value={storageLaptopOption.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Loại ổ cứng <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="SSD" value="SSD" />
                                <Picker.Item label="HDD" value="HDD" />
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Card màn hình <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="Onboard" value="Onboard" />
                                <Picker.Item label="AMD" value="AMD" />
                                <Picker.Item label="NVIDIA" value="NVIDIA" />
                                <Picker.Item label="Khác" value="Khác" />
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Kích cỡ màn hình <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                {screenSizes.map(screenSize => (
                                    <Picker.Item key={screenSize.id} label={screenSize.label} value={screenSize.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Chính sách bảo hành <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="3 tháng" value="3 tháng" />
                                <Picker.Item label="6 tháng" value="6 tháng" />
                                <Picker.Item label="12 tháng" value="12 tháng" />
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Xuất xứ<Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="Việt Nam" value="Việt Nam" />
                                <Picker.Item label="Thái Lan" value="Thái Lan" />
                                <Picker.Item label="Mỹ" value="Mỹ" />
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Giá bán<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='10.000 đ' />
                    </View>
                    <Text className='font-bold text-[16px] uppercase'>Tiêu đề tin đăng và mô tả chi tiết</Text>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Tiêu đề<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='Nhập tiêu đề' />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Mô tả chi tiết<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='Mô tả ...' />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Hình thức đăng tin<Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="Đăng tin thường" value="Đăng tin thường" />
                                <Picker.Item label="Đăng tin trả phí" value="Đăng tin trả phí" />
                            </Picker>
                        </View>
                    </View>
                    <Text className='font-bold text-[16px] uppercase'>Thông tin người bán</Text>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Địa chỉ<Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="Tân Phú, Hậu Giang" value="Đăng tin thường" />
                                <Picker.Item label="Sóc Trăng" value="Đăng tin trả phí" />
                            </Picker>
                        </View>
                    </View>
                    <TouchableHighlight className="rounded-lg mt-4 self-end">
                        <LinearGradient
                            colors={['#523471', '#9C62D7']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            style={{ paddingTop: 12, paddingBottom: 12, paddingStart: 30, paddingEnd: 30, borderRadius: 8 }}
                        >
                            <View className="flex-row items-center justify-center gap-2">
                                <Text className="font-bold text-[18px] text-[#fff]">Đăng tin</Text>
                            </View>
                        </LinearGradient>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        </View>
    )
}

//npm install @react-native-picker/picker cài thư viện này để sử dụng select option giống web
//npm install react-native-image-picker