import { Text, View, ScrollView, TextInput, TouchableHighlight, Button, Image } from 'react-native'

import React, { useState, useEffect, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from 'axios';
import { useAuthCheck } from '../../store/checkLogin';

// Định nghĩa kiểu cho ảnh và video

interface Media {
    uri: string;
}

interface Category {
    _id: string;
    categoryName: string;
}

interface Brand {
    _id: string;
    brandName: string;
    categoryId: string;
}

interface Ram {
    _id: string;
    ramCapacity: string;
}

interface Cpu {
    _id: string;
    cpuName: string;
}

interface Gpu {
    _id: string;
    gpuName: string;
}

interface Screen {
    _id: string;
    screenSize: string;
}

interface Storage {
    _id: string;
    storageCapacity: string;
    storageTypeId: string;
}

interface StorageType {
    _id: string;
    storageName: string;
}

interface Version {
    _id: string;
    versionName: string;
    brandId: {
        _id: string;
        brandName: string;
    };
}

interface ApiResponse<T> {
    data: {
        data: T[];
    }
}

export default function PostCreation() {
    // States cho các trường select
    const checkAuth = useAuthCheck();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCpu, setSelectedCpu] = useState("");
    const [selectedGpu, setSelectedGpu] = useState("");
    const [selectedRam, setSelectedRam] = useState("");
    const [selectedScreen, setSelectedScreen] = useState("");
    const [selectedStorage, setSelectedStorage] = useState("");
    const [selectedStorageType, setSelectedStorageType] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [selectedWarranty, setSelectedWarranty] = useState("3 tháng");
    const [selectedOrigin, setSelectedOrigin] = useState("Việt Nam");
    const [selectedPostType, setSelectedPostType] = useState("Đăng tin thường");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedVersion, setSelectedVersion] = useState("");

    // States cho các trường input
    const [price, setPrice] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [battery, setBattery] = useState("");

    // States cho media
    const [images, setImages] = useState<Media[]>([]);
    const [videos, setVideos] = useState<Media[]>([]);

    // States cho data từ API
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [cpus, setCpus] = useState<Cpu[]>([]);
    const [gpus, setGpus] = useState<Gpu[]>([]);
    const [rams, setRams] = useState<Ram[]>([]);
    const [screens, setScreens] = useState<Screen[]>([]);
    const [storages, setStorages] = useState<Storage[]>([]);
    const [storageTypes, setStorageTypes] = useState<StorageType[]>([]);
    const [versions, setVersions] = useState<Version[]>([]);

    // Các options cố định
    const warrantyOptions = [
        { label: "3 tháng", value: "3 tháng" },
        { label: "6 tháng", value: "6 tháng" },
        { label: "12 tháng", value: "12 tháng" }

//     const checkAuth = useAuthCheck();
//     const [selectedValue, setSelectedValue] = useState("Điện thoại");
//     const [images, setImages] = useState<Media[]>([]); // Định nghĩa kiểu cho images
//     const [videos, setVideos] = useState<Media[]>([]); // Định nghĩa kiểu cho videos
//     const colors = [
//         { id: '1', label: 'Đen', value: 'Đen' },
//         { id: '2', label: 'Đỏ', value: 'Đỏ' },
//         { id: '3', label: 'Cam', value: 'Cam' },
//         { id: '4', label: 'Xanh dương', value: 'Xanh dương' },
//         { id: '5', label: 'Xanh lá', value: 'Xanh lá' },
//         { id: '6', label: 'Vàng', value: 'Vàng' },
//         { id: '7', label: 'Tím', value: 'Tím' },
//         { id: '8', label: 'Trắng', value: 'Trắng' },
//         { id: '9', label: 'Xám', value: 'Xám' },
//         { id: '10', label: 'Nâu', value: 'Nâu' },
//         { id: '11', label: 'Hồng', value: 'Hồng' },
//         { id: '12', label: 'Xanh ngọc', value: 'Xanh ngọc' },
//         { id: '13', label: 'Xanh da trời', value: 'Xanh da trời' },
//         { id: '14', label: 'Vàng chanh', value: 'Vàng chanh' },
//         { id: '15', label: 'Đỏ tươi', value: 'Đỏ tươi' },
//         { id: '16', label: 'Xanh lá cây', value: 'Xanh lá cây' },
//         { id: '17', label: 'Xanh lục', value: 'Xanh lục' },
//         { id: '18', label: 'Xanh dương nhạt', value: 'Xanh dương nhạt' },
//         { id: '19', label: 'Xanh dương đậm', value: 'Xanh dương đậm' },
//         { id: '20', label: 'Đỏ nhạt', value: 'Đỏ nhạt' },
//     ];
//     const brands = [
//         { id: '1', label: 'Apple', value: 'Apple' },
//         { id: '2', label: 'Samsung', value: 'Samsung' },
//         { id: '3', label: 'Xiaomi', value: 'Xiaomi' },
//         { id: '4', label: 'Oppo', value: 'Oppo' },
//         { id: '5', label: 'Vivo', value: 'Vivo' },
//         { id: '6', label: 'Nokia', value: 'Nokia' },
//         { id: '7', label: 'Sony', value: 'Sony' },
//         { id: '8', label: 'Huawei', value: 'Huawei' },
//         { id: '9', label: 'LG', value: 'Lg' },
//         { id: '10', label: 'OnePlus', value: 'Oneplus' },
//         { id: '11', label: 'Realme', value: 'Realme' },
//         { id: '12', label: 'Google', value: 'Google' },
//     ];
//     const storageOptions = [
//         { id: '1', label: '< 8 GB', value: '< 8 GB' },
//         { id: '2', label: '8 GB', value: '8 GB' },
//         { id: '3', label: '16 GB', value: '16 GB' },
//         { id: '4', label: '32 GB', value: '32 GB' },
//         { id: '5', label: '64 GB', value: '64 GB' },
//         { id: '6', label: '128 GB', value: '128 GB' },
//         { id: '7', label: '256 GB', value: '256 GB' },
//         { id: '8', label: '512 GB', value: '512 GB' },
//         { id: '9', label: '1 TB', value: '1 TB' },
//     ];
//     const laptopBrands = [
//         { id: '1', label: 'Apple', value: 'Apple' },
//         { id: '2', label: 'Dell', value: 'Dell' },
//         { id: '3', label: 'HP', value: 'HP' },
//         { id: '4', label: 'Lenovo', value: 'Lenovo' },
//         { id: '5', label: 'Asus', value: 'Asus' },
//         { id: '6', label: 'Acer', value: 'Acer' },
//         { id: '7', label: 'Microsoft', value: 'Microsoft' },
//         { id: '8', label: 'Razer', value: 'Razer' },
//         { id: '9', label: 'Samsung', value: 'Samsung' },
//         { id: '10', label: 'Toshiba', value: 'Toshiba' },
    ];

    const originOptions = [
        { label: "Việt Nam", value: "Việt Nam" },
        { label: "Thái Lan", value: "Thái Lan" },
        { label: "Mỹ", value: "Mỹ" }
    ];

    const postTypeOptions = [
        { label: "Đăng tin thường", value: "Đăng tin thường" },
        { label: "Đăng tin trả phí", value: "Đăng tin trả phí" }
    ];

    const conditionOptions = [
        { label: "Mới", value: "Mới" },
        { label: "Đã sử dụng ( Chưa sửa chữa )", value: "Đã sử dụng ( Chưa sửa chữa )" },
        { label: "Đã sử dụng ( Sửa nhiều lần )", value: "Đã sử dụng ( Sửa nhiều lần )" }
    ];

    const locationOptions = [
        { label: "Tân Phú, Hậu Giang", value: "Tân Phú, Hậu Giang" },
        { label: "Sóc Trăng", value: "Sóc Trăng" }
    ];

    // Fetch data từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get<ApiResponse<Category>>('http://10.0.2.2:5000/api/categories');
                setCategories(categoriesResponse.data.data);

                const brandsResponse = await axios.get<ApiResponse<Brand>>('http://10.0.2.2:5000/api/brands');
                setBrands(brandsResponse.data.data);

                const ramsResponse = await axios.get<ApiResponse<Ram>>('http://10.0.2.2:5000/api/rams');
                setRams(ramsResponse.data.data);

                const screensResponse = await axios.get<ApiResponse<Screen>>('http://10.0.2.2:5000/api/screens');
                setScreens(screensResponse.data.data);

            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchData();
    }, []);

    // Lọc brands theo category
    const filteredBrands = brands.filter(brand => 
        brand.categoryId === selectedCategory
    );

    // Kiểm tra xem có phải category laptop không
    const isLaptopCategory = useMemo(() => {
        return selectedCategory && categories.find(cat => 
            cat._id === selectedCategory && 
            cat.categoryName.toLowerCase() === 'laptop'
        );
    }, [selectedCategory, categories]);

    // Lọc storages dựa trên điều kiện
    const filteredStorages = useMemo(() => {
        if (isLaptopCategory) {
            // Nếu là laptop, chỉ hiển thị storage theo storageType đã chọn
            return storages.filter(storage => 
                storage.storageTypeId?._id === selectedStorageType
            );
        } else {
            // Nếu là điện thoại, chỉ hiển thị storage không có storageType
            return storages.filter(storage => 
                !storage.storageTypeId
            );
        }
    }, [isLaptopCategory, storages, selectedStorageType]);

    // Lọc versions theo brand đã chọn
    const filteredVersions = useMemo(() => {
        return versions.filter(version => 
            version.brandId?._id === selectedBrand
        );
    }, [versions, selectedBrand]);

    // Xử lý submit form
    const handleSubmit = async () => {
        try {
            const formData = {
                categoryId: selectedCategory,
                brandId: selectedBrand,
                cpuId: selectedCpu,
                gpuId: selectedGpu,
                ramId: selectedRam,
                screenId: selectedScreen,
                storageId: selectedStorage,
                storageTypeId: selectedStorageType,
                condition: selectedCondition,
                warranty: selectedWarranty,
                origin: selectedOrigin,
                price: parseFloat(price),
                title,
                description,
                battery,
                postType: selectedPostType,
                location: selectedLocation,
                images,
                videos
            };

            const response = await axios.post('http://10.0.2.2:5000/products', formData);
            if (response.data.success) {
                // Xử lý khi thành công
                console.log('Đăng tin thành công');
            }
        } catch (error) {
            console.error('Lỗi khi đăng tin:', error);
        }
    };

    const handleCategoryChange = async (itemValue: string) => {
        console.log('Selected Category ID:', itemValue);
        setSelectedCategory(itemValue);
        setSelectedBrand("");
        setSelectedVersion(""); // Reset version khi đổi category
        
        if (itemValue) {
            try {
                // Lấy dữ liệu brands và versions
                const [brandsRes, versionsRes] = await Promise.all([
                    axios.get<ApiResponse<Brand>>(`http://10.0.2.2:5000/api/brands?categoryId=${itemValue}`),
                    axios.get<ApiResponse<Version>>('http://10.0.2.2:5000/api/versions')
                ]);

                console.log('Versions Response:', versionsRes.data); // Debug log
                
                setBrands(brandsRes.data.data);
                setVersions(versionsRes.data.data);

                // Kiểm tra category là laptop
                const selectedCategoryObj = categories.find(cat => cat._id === itemValue);
                const isLaptopCategory = selectedCategoryObj?.categoryName.toLowerCase() === 'laptop';
                
                console.log('Is Laptop Category:', isLaptopCategory);

                if (isLaptopCategory) {
                    const [cpusRes, gpusRes, screensRes, storageTypesRes] = await Promise.all([
                        axios.get<ApiResponse<Cpu>>('http://10.0.2.2:5000/api/cpus'),
                        axios.get<ApiResponse<Gpu>>('http://10.0.2.2:5000/api/gpus'),
                        axios.get<ApiResponse<Screen>>('http://10.0.2.2:5000/api/screens'),
                        axios.get<ApiResponse<StorageType>>('http://10.0.2.2:5000/api/storage-types')
                    ]);

                    setCpus(cpusRes.data.data);
                    setGpus(gpusRes.data.data);
                    setScreens(screensRes.data.data);
                    setStorageTypes(storageTypesRes.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                setBrands([]);
                setVersions([]);
            }
        } else {
            setBrands([]);
            setVersions([]);
            setCpus([]);
            setGpus([]);
            setScreens([]);
            setStorageTypes([]);
        }
    };

    // Xử lý khi thay đổi loại ổ cứng
    const handleStorageTypeChange = (itemValue: string) => {
        setSelectedStorageType(itemValue);
        setSelectedStorage(""); // Reset selected storage khi đổi loại ổ cứng
    };

    // Xử lý khi thay đổi brand
    const handleBrandChange = (itemValue: string) => {
        setSelectedBrand(itemValue);
        setSelectedVersion(""); // Reset version khi đổi brand
        console.log('Selected Brand:', itemValue);
        console.log('Available Versions:', filteredVersions);
    };

//     useEffect(() => {
//         checkAuth()
//     }, []);
    return (
        <View className='w-full h-full bg-white p-4'>
            <ScrollView>
                <View className='flex-col gap-5'>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Danh mục <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={handleCategoryChange}
                            >
                                <Picker.Item label="Chọn danh mục" value="" />
                                {categories.map(category => (
                                    <Picker.Item 
                                        key={category._id} 
                                        label={category.categoryName} 
                                        value={category._id} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <Text className='font-bold text-[16px] uppercase'>Thông tin chi tiết</Text>
                    <View className='flex-col gap-2'>
                        <View className='border-2 border-[#D9D9D9] rounded-lg p-3 flex-col items-center'>
                            <Text className='text-[#9661D9] font-semibold self-end'>Hình ảnh hợp lệ</Text>
                            <Icon name='camera' size={40} color='#9661D9' />
                            <TouchableHighlight
                                onPress={() => { }}
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
                                onPress={() => { }}
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
                                selectedValue={selectedCondition}
                                onValueChange={(itemValue) => setSelectedCondition(itemValue)}
                            >
                                {conditionOptions.map((option, index) => (
                                    <Picker.Item key={index} label={option.label} value={option.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    {selectedCategory && (
                        <>
                            <View className='flex-col gap-2'>
                                <Text className='font-bold text-[16px]'>Hãng <Text className='text-[#DC143C]'>*</Text></Text>
                                <View className='border-2 border-[#D9D9D9] rounded-lg'>
                                    <Picker
                                        selectedValue={selectedBrand}
                                        onValueChange={handleBrandChange}
                                    >
                                        <Picker.Item label="Chọn hãng" value="" />
                                        {Array.isArray(brands) && brands.map(brand => (
                                            <Picker.Item 
                                                key={brand._id} 
                                                label={brand.brandName} 
                                                value={brand._id} 
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            {selectedBrand && filteredVersions.length > 0 && (
                                <View className='flex-col gap-2'>
                                    <Text className='font-bold text-[16px]'>Dòng máy <Text className='text-[#DC143C]'>*</Text></Text>
                                    <View className='border-2 border-[#D9D9D9] rounded-lg'>
                                        <Picker
                                            selectedValue={selectedVersion}
                                            onValueChange={(itemValue) => setSelectedVersion(itemValue)}
                                        >
                                            <Picker.Item label="Chọn dòng máy" value="" />
                                            {filteredVersions.map(version => (
                                                <Picker.Item 
                                                    key={version._id} 
                                                    label={version.versionName} 
                                                    value={version._id} 
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                    {isLaptopCategory && (
                        <>
                            <View className='flex-col gap-2'>
                                <Text className='font-bold text-[16px]'>Bộ vi xử lý <Text className='text-[#DC143C]'>*</Text></Text>
                                <View className='border-2 border-[#D9D9D9] rounded-lg'>
                                    <Picker
                                        selectedValue={selectedCpu}
                                        onValueChange={(itemValue) => setSelectedCpu(itemValue)}
                                    >
                                        <Picker.Item label="Chọn CPU" value="" />
                                        {Array.isArray(cpus) && cpus.map(cpu => (
                                            <Picker.Item 
                                                key={cpu._id} 
                                                label={cpu.cpuName} 
                                                value={cpu._id} 
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            <View className='flex-col gap-2'>
                                <Text className='font-bold text-[16px]'>Card đồ họa <Text className='text-[#DC143C]'>*</Text></Text>
                                <View className='border-2 border-[#D9D9D9] rounded-lg'>
                                    <Picker
                                        selectedValue={selectedGpu}
                                        onValueChange={(itemValue) => setSelectedGpu(itemValue)}
                                    >
                                        <Picker.Item label="Chọn GPU" value="" />
                                        {Array.isArray(gpus) && gpus.map(gpu => (
                                            <Picker.Item 
                                                key={gpu._id} 
                                                label={gpu.gpuName} 
                                                value={gpu._id} 
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            <View className='flex-col gap-2'>
                                <Text className='font-bold text-[16px]'>Kích thước màn hình <Text className='text-[#DC143C]'>*</Text></Text>
                                <View className='border-2 border-[#D9D9D9] rounded-lg'>
                                    <Picker
                                        selectedValue={selectedScreen}
                                        onValueChange={(itemValue) => setSelectedScreen(itemValue)}
                                    >
                                        <Picker.Item label="Chọn kích thước màn hình" value="" />
                                        {Array.isArray(screens) && screens.map(screen => (
                                            <Picker.Item 
                                                key={screen._id} 
                                                label={screen.screenSize} 
                                                value={screen._id} 
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            <View className='flex-col gap-2'>
                                <Text className='font-bold text-[16px]'>Loại ổ cứng <Text className='text-[#DC143C]'>*</Text></Text>
                                <View className='border-2 border-[#D9D9D9] rounded-lg'>
                                    <Picker
                                        selectedValue={selectedStorageType}
                                        onValueChange={handleStorageTypeChange}
                                    >
                                        <Picker.Item label="Chọn loại ổ cứng" value="" />
                                        {Array.isArray(storageTypes) && storageTypes.map(storageType => (
                                            <Picker.Item 
                                                key={storageType._id} 
                                                label={storageType.storageName} 
                                                value={storageType._id} 
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </>
                    )}
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Ram <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                selectedValue={selectedRam}
                                onValueChange={(itemValue) => setSelectedRam(itemValue)}
                            >
                                {rams.map(ram => (
                                    <Picker.Item 
                                        key={ram._id} 
                                        label={ram.ramCapacity} 
                                        value={ram._id} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    {selectedCategory && (
                        <View className='flex-col gap-2'>
                            <Text className='font-bold text-[16px]'>Dung lượng bộ nhớ <Text className='text-[#DC143C]'>*</Text></Text>
                            <View className='border-2 border-[#D9D9D9] rounded-lg'>
                                <Picker
                                    selectedValue={selectedStorage}
                                    onValueChange={(itemValue) => setSelectedStorage(itemValue)}
                                    enabled={!isLaptopCategory || (isLaptopCategory && selectedStorageType !== "")}
                                >
                                    <Picker.Item 
                                        label={
                                            isLaptopCategory && !selectedStorageType 
                                                ? "Vui lòng chọn loại ổ cứng trước" 
                                                : "Chọn dung lượng bộ nhớ"
                                        } 
                                        value="" 
                                    />
                                    {Array.isArray(filteredStorages) && filteredStorages.map(storage => (
                                        <Picker.Item 
                                            key={storage._id} 
                                            label={storage.storageCapacity} 
                                            value={storage._id} 
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Chính sách bảo hành <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedWarranty}
                                onValueChange={(itemValue) => setSelectedWarranty(itemValue)}
                            >
                                {warrantyOptions.map((option, index) => (
                                    <Picker.Item key={index} label={option.label} value={option.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Xuất xứ<Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedOrigin}
                                onValueChange={(itemValue) => setSelectedOrigin(itemValue)}
                            >
                                {originOptions.map((option, index) => (
                                    <Picker.Item key={index} label={option.label} value={option.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Giá bán<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='10.000 đ'
                            value={price}
                            onChangeText={setPrice}
                        />
                    </View>
                    <Text className='font-bold text-[16px] uppercase'>Tiêu đề tin đăng và mô tả chi tiết</Text>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Tiêu đề<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='Nhập tiêu đề'
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Mô tả chi tiết<Text className='text-[#DC143C]'>*</Text></Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='Mô tả ...'
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Hình thức đăng tin<Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedPostType}
                                onValueChange={(itemValue) => setSelectedPostType(itemValue)}
                            >
                                {postTypeOptions.map((option, index) => (
                                    <Picker.Item key={index} label={option.label} value={option.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <Text className='font-bold text-[16px] uppercase'>Thông tin người bán</Text>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Địa chỉ<Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                className='font-semibold'
                                selectedValue={selectedLocation}
                                onValueChange={(itemValue) => setSelectedLocation(itemValue)}
                            >
                                {locationOptions.map((option, index) => (
                                    <Picker.Item key={index} label={option.label} value={option.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <TouchableHighlight 
                        className="rounded-lg mt-4 self-end"
                        onPress={handleSubmit}
                    >
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