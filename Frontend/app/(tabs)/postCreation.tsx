import { Text, View, ScrollView, ActivityIndicator, TextInput, TouchableHighlight, Button, Image, Alert, TouchableOpacity } from 'react-native'

import React, { useState, useEffect, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from 'axios';
import { useAuthCheck } from '../../store/checkLogin';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, ResizeMode } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';


const API_URL = "http://10.0.2.2:5000/api/uploadmultiple";
const API_URL_UPLOAD_VIDEO = "http://10.0.2.2:5000/api/uploadvideo";
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

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
    storageTypeId: StorageType | string; // Có thể là object hoặc string ID
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

// Thêm interfaces cho địa chỉ từ API
interface Province {
    code: string;
    name: string;
    division_type: string;
    codename: string;
    phone_code: number;
}

interface District {
    code: string;
    name: string;
    division_type: string;
    codename: string;
    province_code: string;
}

// Thêm interface cho Condition
interface Condition {
    _id: string;
    condition: string;
}

// Thêm interface cho options xuất xứ
interface OriginOption {
    label: string;
    value: string;
}

// Thêm import useSelector

export default function PostCreation() {
    const params = useLocalSearchParams();
    const id = params.id;
    console.log("ID từ params:", id, typeof id);
    
    const isEditMode = typeof id === 'string' && id.length > 0;
    console.log("isEditMode:", isEditMode);
    
    const router = useRouter();
    
    // Lấy user từ Redux store
    const { user } = useSelector((state: RootState) => state.auth);
    const [avatarUrls, setAvatarUrls] = useState<string[]>([]);
    const [video, setVideo] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [initialVideoUrl, setInitialVideoUrl] = useState<string | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [videoloading, setVideoLoading] = useState(false);
    const [deletingVideo, setDeletingVideo] = useState(false);
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
    const [conditions, setConditions] = useState<Condition[]>([]);
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
    const [battery, setBattery] = useState<string>('');

    // States cho media
    const [images, setImages] = useState<string[]>([]);
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

    // States cho địa chỉ
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    // Các options cố định
    const warrantyOptions = [
        { label: "3 tháng", value: "3 tháng" },
        { label: "6 tháng", value: "6 tháng" },
        { label: "12 tháng", value: "12 tháng" }
    ];

    // Thêm mảng các options xuất xứ
    const originOptions: OriginOption[] = [
        { label: "Chọn xuất xứ", value: "" },
        { label: "Chính hãng", value: "Chính hãng" },
        { label: "Xách tay", value: "Xách tay" },
        { label: "Nhập khẩu", value: "Nhập khẩu" }
    ];

    const postTypeOptions = [
        { label: "Đăng tin thường", value: "Đăng tin thường" },
        { label: "Đăng tin trả phí", value: "Đăng tin trả phí" }
    ];

    // Thêm useEffect để fetch conditions
    useEffect(() => {
        const fetchConditions = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:5000/api/conditions');
                setConditions(response.data.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tình trạng:', error);
            }
        };
        fetchConditions();
    }, []);

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

    // Fetch storage và storageTypes khi component mount
    useEffect(() => {
        const fetchStorageData = async () => {
            try {
                const [storagesResponse, storageTypesResponse] = await Promise.all([
                    axios.get('http://10.0.2.2:5000/api/storages'),
                    axios.get('http://10.0.2.2:5000/api/storage-types')
                ]);

                setStorages(storagesResponse.data.data);
                setStorageTypes(storageTypesResponse.data.data);
                console.log('Storages:', storagesResponse.data.data);
                console.log('Storage Types:', storageTypesResponse.data.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu storage:', error);
            }
        };

        fetchStorageData();
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
        if (!selectedCategory) return [];

        if (isLaptopCategory) {
            // Nếu là laptop, lọc theo storageType đã chọn
            return storages.filter(storage => {
                const storageTypeId = typeof storage.storageTypeId === 'object'
                    ? storage.storageTypeId._id
                    : storage.storageTypeId;
                return storageTypeId === selectedStorageType;
            });
        } else {
            // Nếu là điện thoại, chỉ hiển thị storage không có storageType
            return storages.filter(storage => !storage.storageTypeId);
        }
    }, [isLaptopCategory, storages, selectedStorageType, selectedCategory]);

    // Lọc versions theo brand đã chọn
    const filteredVersions = useMemo(() => {
        return versions.filter(version =>
            version.brandId?._id === selectedBrand
        );
    }, [versions, selectedBrand]);

    // Fetch provinces khi component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/p/');
                setProvinces(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh/thành:', error);
            }
        };

        fetchProvinces();
    }, []);

    // Cập nhật hàm fetch districts và thêm hàm fetch wards
    const handleProvinceChange = async (provinceCode: string) => {
        setSelectedProvince(provinceCode);
        setSelectedDistrict(""); // Reset district
        setSelectedWard(""); // Reset ward
        setDetailAddress(""); // Reset detail address

        if (provinceCode) {
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
                setDistricts(response.data.districts);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách quận/huyện:', error);
                setDistricts([]);
            }
        } else {
            setDistricts([]);
            setWards([]);
        }
    };

    const handleDistrictChange = async (districtCode: string) => {
        setSelectedDistrict(districtCode);
        setSelectedWard(""); // Reset ward
        setDetailAddress(""); // Reset detail address

        if (districtCode) {
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
                setWards(response.data.wards);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách phường/xã:', error);
                setWards([]);
            }
        } else {
            setWards([]);
        }
        updateFullAddress();
    };

    const handleWardChange = (wardCode: string) => {
        setSelectedWard(wardCode);
        updateFullAddress();
    };

    const handleDetailAddressChange = (text: string) => {
        setDetailAddress(text);
        updateFullAddress();
    };

    // Hàm cập nhật địa chỉ đầy đủ
    const updateFullAddress = () => {
        const provinceName = provinces.find(p => p.code === selectedProvince)?.name || '';
        const districtName = districts.find(d => d.code === selectedDistrict)?.name || '';
        const wardName = wards.find(w => w.code === selectedWard)?.name || '';

        let fullAddress = '';

        if (detailAddress) {
            fullAddress += detailAddress;
        }
        if (wardName) {
            fullAddress += fullAddress ? `, ${wardName}` : wardName;
        }
        if (districtName) {
            fullAddress += fullAddress ? `, ${districtName}` : districtName;
        }
        if (provinceName) {
            fullAddress += fullAddress ? `, ${provinceName}` : provinceName;
        }

        setSelectedLocation(fullAddress);
    };

    // Thêm state để theo dõi trạng thái tải dữ liệu
    const [pageLoading, setPageLoading] = useState(false);
    
    // Thêm state để lưu trữ ảnh ban đầu khi edit
    const [initialImages, setInitialImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

    // Hàm xóa một ảnh cụ thể
    const handleDeleteImage = async (imageUrl: string) => {
        try {
            console.log('Deleting image:', imageUrl);
            
            // Kiểm tra xem URL có hợp lệ không
            if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
                console.error('Invalid image URL:', imageUrl);
                Alert.alert('Lỗi', 'URL ảnh không hợp lệ');
                return;
            }
            
            // Đặt trạng thái đang xóa cho ảnh này
            setDeletingImageId(imageUrl);
            
            // Xóa ảnh khỏi UI ngay lập tức để trải nghiệm người dùng tốt hơn
            setAvatarUrls(prevUrls => prevUrls.filter(url => url !== imageUrl));
            
            // Hiển thị thông báo đang xử lý (chỉ log, không hiển thị cho người dùng)
            console.log('Sending delete request to server...');
            
            // Gửi request xóa ảnh đến server
            const response = await axios.post('http://10.0.2.2:5000/api/deleteImage', {
                imageUrl
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Delete response:', response.data);
            
            if (response.data && response.data.success) {
                console.log('Image deleted successfully on server');
            } else {
                console.log('Server reported issue with deletion:', response.data?.message || 'Unknown error');
                // Không hiển thị thông báo lỗi cho người dùng vì ảnh đã được xóa khỏi UI
            }
            
            // Đặt lại trạng thái xóa
            setDeletingImageId(null);
        } catch (error: any) {
            console.error('Lỗi khi xóa ảnh:', error);
            // Không hiển thị thông báo lỗi cho người dùng vì ảnh đã được xóa khỏi UI
            
            // Đặt lại trạng thái xóa
            setDeletingImageId(null);
        }
    };

    // Hàm xóa video
    const handleDeleteVideo = async () => {
        try {
            // Kiểm tra xem URL có hợp lệ không
            if (!videoUrl || !videoUrl.includes('cloudinary.com')) {
                console.error('Invalid video URL:', videoUrl);
                Alert.alert('Lỗi', 'URL video không hợp lệ');
                return;
            }
            
            // Hiển thị trạng thái đang xóa
            setDeletingVideo(true);
            
            // Hiển thị thông báo đang xử lý (chỉ log, không hiển thị cho người dùng)
            console.log('Sending delete request to server for video...');
            console.log('Video URL to delete:', videoUrl);
            
            // Gửi request xóa video đến server
            const response = await axios.post('http://10.0.2.2:5000/api/deleteVideo', {
                videoUrl
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Delete video response:', response.data);
            
            if (response.data && response.data.success) {
                console.log('Video deleted successfully on server');
                // Xóa video khỏi UI sau khi xóa thành công trên server
                setVideoUrl(null);
                setThumbnail(null);
                
                // Nếu đang ở chế độ chỉnh sửa, cập nhật trường videos của sản phẩm
                if (isEditMode && id) {
                    try {
                        // Gửi request cập nhật sản phẩm để xóa trường videos
                        await axios.patch(`http://10.0.2.2:5000/api/products/${id}/update-video`, {
                            videos: ''
                        });
                        console.log('Product video field updated to empty');
                    } catch (updateError) {
                        console.error('Error updating product video field:', updateError);
                    }
                }
                
                Alert.alert('Thành công', 'Đã xóa video thành công');
            } else {
                console.log('Server reported issue with video deletion:', response.data?.message || 'Unknown error');
                Alert.alert('Lỗi', 'Không thể xóa video. Vui lòng thử lại sau.');
            }
        } catch (error: any) {
            console.error('Lỗi khi xóa video:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
            Alert.alert('Lỗi', 'Không thể xóa video. Vui lòng thử lại sau.');
        } finally {
            setDeletingVideo(false);
        }
    };

    // Validate form
    const validateForm = () => {
        // Validate các trường bắt buộc
        if (!selectedCategory || !selectedBrand || !selectedCondition ||
            !selectedStorage || !selectedWarranty || !selectedOrigin ||
            !title || !description || !price || !selectedPostType ||
            !selectedRam) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin sản phẩm');
            return false;
        }
        
        if (avatarUrls.length === 0) {
            Alert.alert('Thông báo', 'Vui lòng chọn ảnh sản phẩm');
            return false;
        } else if (avatarUrls.length > 6) {
            Alert.alert('Thông báo', 'Vui lòng chọn tối đa 6 ảnh sản phẩm');
            return false;
        }

        return true;
    };

    // Cập nhật hàm handleSubmit
    const handleSubmit = async () => {
        if (!user) {
            Alert.alert('Thông báo', 'Vui lòng đăng nhập để đăng tin');
            return;
        }

        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            // Upload ảnh và video mới (nếu có)
            if (images.length > 0) {
                await uploadImages();
            }
            if (video) {
                await uploadVideo();
            }

            // Nếu đang ở chế độ edit, xóa các ảnh không còn sử dụng
            if (isEditMode && initialImages.length > 0) {
                try {
                    console.log('Ảnh ban đầu:', initialImages);
                    console.log('Ảnh hiện tại:', avatarUrls);
                    await axios.post('http://10.0.2.2:5000/api/deleteUnusedImages', {
                        oldImageUrls: initialImages,
                        newImageUrls: avatarUrls
                    });
                } catch (error) {
                    console.error('Lỗi khi xóa ảnh không sử dụng:', error);
                }
            }

            // Kiểm tra nếu đang ở chế độ edit và video đã bị xóa
            if (isEditMode && initialVideoUrl && !videoUrl) {
                try {
                    console.log('Video đã bị xóa, cập nhật trường videos thành rỗng');
                    await axios.patch(`http://10.0.2.2:5000/api/products/${id}/update-video`, {
                        videos: ''
                    });
                } catch (error) {
                    console.error('Lỗi khi cập nhật trường videos:', error);
                }
            }

            const productData = {
                userId: user.id,
                categoryId: selectedCategory,
                versionId: selectedVersion,
                conditionId: selectedCondition,
                storageId: selectedStorage,
                title,
                description,
                price: parseFloat(price),
                isVip: selectedPostType === "Đăng tin trả phí",
                warranty: selectedWarranty,
                videos: videoUrl || '',
                location: {
                    provinceCode: selectedProvince,
                    provinceName: provinces.find(p => p.code === selectedProvince)?.name,
                    districtCode: selectedDistrict,
                    districtName: districts.find(d => d.code === selectedDistrict)?.name,
                    wardCode: selectedWard,
                    wardName: wards.find(w => w.code === selectedWard)?.name,
                    detailAddress: detailAddress,
                    fullAddress: selectedLocation
                },
                images: avatarUrls,
                cpuId: selectedCpu,
                gpuId: selectedGpu,
                ramId: selectedRam,
                screenId: selectedScreen,
                battery: battery || "0",
                origin: selectedOrigin,
                storageTypeId: selectedStorageType
            };

            let response;
            if (isEditMode) {
                // Gọi API cập nhật sản phẩm
                response = await axios.put(`http://10.0.2.2:5000/api/products/${id}`, productData);
                Alert.alert('Thành công', 'Cập nhật tin thành công', [
                    { 
                        text: 'OK', 
                        onPress: () => {
                            // Chuyển về trang quản lý tin
                            router.replace('/postManagement');
                            
                            // Sau đó chuyển về form đăng tin mới (không phải ở chế độ edit)
                            setTimeout(() => {
                                resetForm(); // Reset form về trạng thái ban đầu
                                router.replace('/postCreation'); // Chuyển đến trang đăng tin mới
                            }, 100);
                        } 
                    }
                ]);
            } else {
                // Gọi API tạo sản phẩm mới
                response = await axios.post('http://10.0.2.2:5000/api/products', productData);
                Alert.alert('Thành công', 'Đăng tin thành công', [
                    { 
                        text: 'OK', 
                        onPress: () => {
                            resetForm(); // Reset form về trạng thái ban đầu
                            router.replace('/postManagement'); // Chuyển đến trang quản lý tin
                        } 
                    }
                ]);
            }

        } catch (error) {
            console.error('Lỗi khi xử lý tin:', error);
            Alert.alert('Lỗi', error.response?.data?.message || `Có lỗi xảy ra khi ${isEditMode ? 'cập nhật' : 'đăng'} tin`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cập nhật useEffect để lấy dữ liệu sản phẩm
    useEffect(() => {
        const fetchProductData = async () => {
            if (!isEditMode || !id) return;

            try {
                setPageLoading(true);
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`http://10.0.2.2:5000/api/products/edit/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const productData = response.data;
                console.log("Dữ liệu sản phẩm nhận được:", productData);

                // Lưu danh sách ảnh ban đầu và hiện tại
                if (productData.images && Array.isArray(productData.images)) {
                    console.log("Ảnh sản phẩm:", productData.images);
                    setInitialImages([...productData.images]);
                    setAvatarUrls([...productData.images]);
                }

                // Cập nhật các state khác
                setSelectedCategory(productData.categoryId);
                setSelectedBrand(productData.brandId);
                setSelectedVersion(productData.versionId);
                setSelectedCondition(productData.conditionId);
                setSelectedStorage(productData.storageId);
                setSelectedRam(productData.ramId);
                setTitle(productData.title);
                setDescription(productData.description);
                setPrice(productData.price.toString());
                setSelectedWarranty(productData.warranty);
                setSelectedPostType(productData.isVip ? "Đăng tin trả phí" : "Đăng tin thường");
                setVideoUrl(productData.videos || null);
                setInitialVideoUrl(productData.videos || null);

                // Cập nhật thông tin chi tiết
                if (productData.cpuId) setSelectedCpu(productData.cpuId);
                if (productData.gpuId) setSelectedGpu(productData.gpuId);
                if (productData.screenId) setSelectedScreen(productData.screenId);
                if (productData.storageTypeId) setSelectedStorageType(productData.storageTypeId);
                if (productData.battery) setBattery(productData.battery);
                if (productData.origin) setSelectedOrigin(productData.origin);

                // Cập nhật thông tin địa chỉ
                if (productData.location) {
                    setSelectedProvince(productData.location.provinceCode || "");
                    setSelectedDistrict(productData.location.districtCode || "");
                    setSelectedWard(productData.location.wardCode || "");
                    setDetailAddress(productData.location.detailAddress || "");
                    setSelectedLocation(productData.location.fullAddress || "");

                    // Fetch districts và wards dựa trên province và district đã chọn
                    if (productData.location.provinceCode) {
                        const provinceResponse = await axios.get(`https://provinces.open-api.vn/api/p/${productData.location.provinceCode}?depth=2`);
                        setDistricts(provinceResponse.data.districts);

                        if (productData.location.districtCode) {
                            const districtResponse = await axios.get(`https://provinces.open-api.vn/api/d/${productData.location.districtCode}?depth=2`);
                            setWards(districtResponse.data.wards);
                        }
                    }
                }

                // Nếu có video, tạo thumbnail
                if (productData.videos) {
                    try {
                        const { uri } = await VideoThumbnails.getThumbnailAsync(productData.videos, { time: 1000 });
                        setThumbnail(uri);
                    } catch (err) {
                        console.error("Thumbnail generation error:", err);
                    }
                }

            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
                Alert.alert('Lỗi', 'Không thể lấy thông tin sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setPageLoading(false);
            }
        };

        fetchProductData();
    }, [isEditMode, id]);

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
        setSelectedStorage(""); // Reset selected storage
        console.log('Selected Storage Type:', itemValue);
    };

    // Xử lý khi thay đổi brand
    const handleBrandChange = (itemValue: string) => {
        setSelectedBrand(itemValue);
        setSelectedVersion(""); // Reset version khi đổi brand
        console.log('Selected Brand:', itemValue);
        console.log('Available Versions:', filteredVersions);
    };

    useEffect(() => {
        checkAuth()
    }, [checkAuth]);

    const selectImages = async () => {
        // Kiểm tra nếu đã đạt số lượng ảnh tối đa
        if (avatarUrls.length >= 6) {
            Alert.alert(
                "Số lượng ảnh tối đa",
                "Bạn đã đạt số lượng ảnh tối đa (6 ảnh). Vui lòng xóa bớt ảnh trước khi thêm mới.",
                [{ text: "OK" }]
            );
            return;
        }

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Cần quyền truy cập", "Ứng dụng cần quyền truy cập thư viện ảnh để tiếp tục!");
            return;
        }

        // Tính toán số lượng ảnh còn có thể chọn
        const remainingImages = 6 - avatarUrls.length;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
            selectionLimit: remainingImages, // Giới hạn số lượng ảnh có thể chọn
        });

        if (!result.canceled) {
            // Kiểm tra nếu tổng số ảnh vượt quá giới hạn
            if (result.assets.length > remainingImages) {
                Alert.alert(
                    "Quá nhiều ảnh",
                    `Bạn chỉ có thể chọn thêm tối đa ${remainingImages} ảnh.`,
                    [{ text: "OK" }]
                );
                // Chỉ lấy số lượng ảnh còn lại được phép
                const selectedImages = result.assets.slice(0, remainingImages).map(asset => asset.uri);
                setImages(selectedImages);
            } else {
                const selectedImages = result.assets.map(asset => asset.uri);
                setImages(selectedImages);
            }
        }
    };

    const uploadImages = async () => {
        if (images.length === 0) {
            Alert.alert("Vui lòng chọn ảnh trước");
            return;
        }

        // Kiểm tra tổng số ảnh sau khi tải lên không vượt quá 6
        if (avatarUrls.length + images.length > 6) {
            Alert.alert(
                "Quá nhiều ảnh", 
                `Bạn đã có ${avatarUrls.length} ảnh. Chỉ có thể tải thêm tối đa ${6 - avatarUrls.length} ảnh nữa.`,
                [
                    { text: "OK" }
                ]
            );
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            images.forEach((image, index) => {
                formData.append("images", {
                    uri: image,
                    type: "image/jpeg",
                    name: `image-${index}.jpg`,
                } as any);
            });

            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (!response.data.success) {
                let errorMessage = "Upload thất bại:\n";
                
                if (response.data.details) {
                    if (response.data.details.hasInappropriateContent) {
                        const inappropriateFiles = response.data.details.inappropriateFiles || [];
                        errorMessage += "Các ảnh không phù hợp hoặc trùng lặp:\n";
                        inappropriateFiles.forEach((fileName: string) => {
                            errorMessage += `- ${fileName}\n`;
                        });
                    }
                    
                    if (response.data.details.isDuplicate) {
                        errorMessage += "Một số ảnh đã tồn tại trong hệ thống\n";
                    }
                }
                
                Alert.alert(
                    "Upload Thất Bại", 
                    errorMessage,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
                setLoading(false);
                return;
            }

            // Giữ lại ảnh cũ và thêm ảnh mới
            const newUrls = [...avatarUrls, ...(response.data.urls || [])];
            setAvatarUrls(newUrls);
            // Xóa ảnh đã chọn sau khi tải lên thành công
            setImages([]);
            
            Alert.alert(
                "Thành công", 
                "Upload ảnh thành công",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        } catch (error) {
            // console.error('Lỗi khi upload ảnh:', error);
            Alert.alert('Phát hiện có ảnh đã được sử dụng , vui lòng chọn ảnh chính chủ hoặc xóa bỏ hình ảnh trùng lắp  ');
        } finally {
            setLoading(false);
        }
    };

    const selectVideo = async () => {
        // Kiểm tra nếu đã có video
        if (videoUrl) {
            Alert.alert(
                "Video đã tồn tại", 
                "Bạn đã tải lên một video. Vui lòng xóa video hiện tại trước khi chọn video mới.",
                [{ text: "OK" }]
            );
            return;
        }

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Cần quyền truy cập", "Ứng dụng cần quyền truy cập thư viện để tiếp tục!");
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 1,
                videoMaxDuration: 60, // Giới hạn thời lượng video tối đa 60 giây
            });

            if (!result.canceled) {
                // Kiểm tra kích thước video
                const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
                if (fileInfo.size > MAX_VIDEO_SIZE) {
                    Alert.alert(
                        "Video quá lớn", 
                        "Kích thước video vượt quá 50MB. Vui lòng chọn video nhỏ hơn.",
                        [{ text: "OK" }]
                    );
                    return;
                }

                setVideo(result.assets[0].uri);
                
                // Tạo thumbnail cho video
                try {
                    const { uri } = await VideoThumbnails.getThumbnailAsync(result.assets[0].uri, { time: 1000 });
                    setThumbnail(uri);
                } catch (err) {
                    console.error("Lỗi khi tạo thumbnail:", err);
                }
            }
        } catch (error) {
            console.error("Lỗi khi chọn video:", error);
            Alert.alert("Lỗi", "Không thể chọn video. Vui lòng thử lại sau.");
        }
    };

    const uploadVideo = async () => {
        if (!video) {
            Alert.alert("Vui lòng chọn video trước");
            return;
        }

        // Kiểm tra nếu đã có video
        if (videoUrl) {
            Alert.alert(
                "Video đã tồn tại", 
                "Bạn đã tải lên một video. Vui lòng xóa video hiện tại trước khi tải lên video mới.",
                [{ text: "OK" }]
            );
            return;
        }

        setVideoLoading(true);

        try {
            // Kiểm tra kích thước video
            const fileInfo = await FileSystem.getInfoAsync(video);
            if (fileInfo.size > MAX_VIDEO_SIZE) {
                Alert.alert(
                    "Video quá lớn", 
                    "Kích thước video vượt quá 50MB. Vui lòng chọn video nhỏ hơn.",
                    [{ text: "OK" }]
                );
                setVideoLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("video", {
                uri: video,
                type: "video/mp4",
                name: "video.mp4",
            } as any);

            const response = await axios.post(API_URL_UPLOAD_VIDEO, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data && response.data.success) {
                setVideoUrl(response.data.url);
                setVideo(null); // Xóa video đã chọn sau khi tải lên thành công
                
                Alert.alert(
                    "Thành công", 
                    "Upload video thành công",
                    [{ text: "OK" }]
                );
            } else {
                Alert.alert(
                    "Upload Thất Bại", 
                    response.data?.message || "Không thể tải lên video. Vui lòng thử lại sau.",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.error('Lỗi khi upload video:', error);
            Alert.alert(
                "Lỗi", 
                "Không thể tải lên video. Vui lòng thử lại sau.",
                [{ text: "OK" }]
            );
        } finally {
            setVideoLoading(false);
        }
    };

    // Hàm reset form
    const resetForm = () => {
        setSelectedCategory("");
        setSelectedBrand("");
        setSelectedVersion("");
        setSelectedCondition("");
        setSelectedRam("");
        setSelectedStorage("");
        setSelectedCpu("");
        setSelectedGpu("");
        setSelectedScreen("");
        setSelectedStorageType("");
        setBattery("");
        setTitle("");
        setDescription("");
        setPrice("");
        setSelectedWarranty("3 tháng");
        setSelectedOrigin("Việt Nam");
        setSelectedPostType("Đăng tin thường");
        setImages([]);
        setAvatarUrls([]);
        setInitialImages([]);
        setVideo(null);
        setVideoUrl(null);
        setInitialVideoUrl(null);
        setThumbnail(null);
        
        // Reset location data
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
        setDetailAddress("");
        setSelectedLocation("");
        
        // Reset các state khác nếu có
    };

    // Thêm một nút riêng biệt ở đầu trang
    const renderNewPostButton = () => {
        if (isEditMode) {
            return (
                <TouchableHighlight
                    style={{
                        marginVertical: 10,
                        alignSelf: 'center',
                        borderRadius: 8,
                        overflow: 'hidden'
                    }}
                    onPress={() => {
                        Alert.alert(
                            'Xác nhận',
                            'Bạn muốn tạo tin mới thay vì sửa tin này?',
                            [
                                { text: 'Hủy', style: 'cancel' },
                                { 
                                    text: 'Đồng ý', 
                                    onPress: () => {
                                        resetForm(); // Reset form trước khi chuyển trang
                                        router.replace('/postCreation');
                                    }
                                }
                            ]
                        );
                    }}
                >
                    <LinearGradient
                        colors={['#523471', '#9C62D7']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={{ 
                            paddingVertical: 10, 
                            paddingHorizontal: 20, 
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8
                        }}
                    >
                        <Icon name="plus" size={16} color="#fff" />
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                            Tạo tin mới
                        </Text>
                    </LinearGradient>
                </TouchableHighlight>
            );
        }
        return null;
    };

    if (pageLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#9661D9" />
                <Text style={{ marginTop: 10 }}>Đang tải thông tin sản phẩm...</Text>
            </View>
        );
    }
    
    return (
        <View className='w-full h-full bg-white p-4'>
            <ScrollView>
                <View className='flex-col gap-5'>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[20px] text-center'>
                        {isEditMode ? 'Chỉnh sửa tin đăng' : 'Đăng tin mới'}
                    </Text>
                    
                    {/* Hiển thị nút tạo tin mới */}
                    {renderNewPostButton()}
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
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
                                <Text className='text-[#9661D9] font-semibold'>Đăng từ 01 đến 06 hình</Text>
                                {avatarUrls.length > 0 && (
                                    <TouchableOpacity 
                                        onPress={() => {
                                            Alert.alert(
                                                "Xác nhận",
                                                "Bạn có chắc muốn xóa tất cả ảnh đã tải lên?",
                                                [
                                                    { text: "Hủy", style: "cancel" },
                                                    { 
                                                        text: "Xóa tất cả", 
                                                        style: "destructive",
                                                        onPress: () => setAvatarUrls([]) 
                                                    }
                                                ]
                                            );
                                        }}
                                    >
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Xóa tất cả</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={{display: images.length > 0 || avatarUrls.length > 0 ? 'none' : 'flex', marginTop: 10 }}> 
                                <Icon name='camera' size={40} color='#9661D9' />
                            </View>
                            {(avatarUrls.length > 0 || images.length > 0) && (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 5 }}>
                                    <Text style={{ color: '#666' }}>
                                        Đã tải lên: {avatarUrls.length}/6 ảnh
                                    </Text>
                                    <Text style={{ color: avatarUrls.length >= 6 ? 'red' : '#666' }}>
                                        Còn lại: {6 - avatarUrls.length} ảnh
                                    </Text>
                                </View>
                            )}
                            {images.length > 0 && <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 10, marginBottom: 10 }}>
                                {images.map((image, index) => (
                                    <View key={index} style={{ position: 'relative', margin: 5 }}>
                                        <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 5 }} />
                                        <TouchableOpacity 
                                            style={{ 
                                                position: 'absolute', 
                                                top: -5, 
                                                right: -5, 
                                                backgroundColor: 'rgba(255,0,0,0.7)', 
                                                borderRadius: 10,
                                                width: 20,
                                                height: 20,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                            onPress={() => {
                                                const newImages = [...images];
                                                newImages.splice(index, 1);
                                                setImages(newImages);
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>}
                            {avatarUrls.length > 0 && <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 10, marginBottom: 10 }}>
                                {avatarUrls.map((url, index) => (
                                    <View key={index} style={{ position: 'relative', margin: 5 }}>
                                        <Image source={{ uri: url }} style={{ width: 100, height: 100, borderRadius: 5 }} />
                                        <TouchableOpacity 
                                            style={{ 
                                                position: 'absolute', 
                                                top: -5, 
                                                right: -5, 
                                                backgroundColor: 'rgba(255,0,0,0.7)', 
                                                borderRadius: 10,
                                                width: 20,
                                                height: 20,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                            onPress={() => handleDeleteImage(url)}
                                            disabled={deletingImageId === url}
                                        >
                                            {deletingImageId === url ? (
                                                <ActivityIndicator size="small" color="white" />
                                            ) : (
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>}
                            {loading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 10, marginBottom: 10 }} />}
                            <View style={{ flexDirection: "row", justifyContent: "center", gap: 20, marginBottom: 10, marginTop: 10 }}>
                                <Button title="Chọn ảnh" onPress={selectImages} />
                                <Button 
                                    title="Tải ảnh lên" 
                                    onPress={uploadImages} 
                                    disabled={images.length === 0 || avatarUrls.length >= 6} 
                                />
                            </View>
                            {avatarUrls.length >= 6 && (
                                <Text style={{ color: 'red', marginTop: 5, textAlign: 'center' }}>
                                    Đã đạt số lượng ảnh tối đa (6 ảnh)
                                </Text>
                            )}
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <View className='border-2 border-[#D9D9D9] rounded-lg p-3 flex-col items-center'>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
                                <Text className='text-[#9661D9] font-semibold'>Đăng tối đa 1 video dưới 50MB</Text>
                                {videoUrl && (
                                    <TouchableOpacity 
                                        onPress={() => {
                                            Alert.alert(
                                                "Xác nhận",
                                                "Bạn có chắc muốn xóa video đã tải lên?",
                                                [
                                                    { text: "Hủy", style: "cancel" },
                                                    { 
                                                        text: "Xóa", 
                                                        style: "destructive",
                                                        onPress: handleDeleteVideo
                                                    }
                                                ]
                                            );
                                        }}
                                        disabled={deletingVideo}
                                    >
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Xóa video</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            {!video && !videoUrl && <Icon className='mt-4' name='video-camera' size={40} color='#9661D9' />}
                            {videoUrl && (
                                <Text style={{ marginTop: 5, color: '#666', marginBottom: 5 }}>
                                    Đã tải lên video
                                </Text>
                            )}
                            {video && (
                                <View style={{ position: 'relative', marginVertical: 10 }}>
                                    <Video
                                        source={{ uri: video }}
                                        style={{ width: 300, height: 200 }}
                                        useNativeControls
                                        resizeMode={ResizeMode.CONTAIN}
                                    />
                                    <TouchableOpacity 
                                        style={{ 
                                            position: 'absolute', 
                                            top: 5, 
                                            right: 5, 
                                            backgroundColor: 'rgba(255,0,0,0.7)', 
                                            borderRadius: 10,
                                            width: 20,
                                            height: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                        onPress={() => {
                                            setVideo(null);
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {videoUrl && !video && (
                                <View style={{ position: 'relative', marginVertical: 10 }}>
                                    <Video
                                        source={{ uri: videoUrl }}
                                        style={{ width: 300, height: 200 }}
                                        useNativeControls
                                        resizeMode={ResizeMode.CONTAIN}
                                    />
                                    {deletingVideo && (
                                        <View style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <ActivityIndicator size="large" color="#fff" />
                                            <Text style={{ color: '#fff', marginTop: 10 }}>Đang xóa video...</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                            {videoloading && <ActivityIndicator size="large" color="blue" style={{ marginVertical: 10 }}/>}
                            <View style={{ flexDirection: "row", justifyContent: "center", gap: 20, marginVertical: 10 }}>
                                <Button 
                                    title="Chọn video" 
                                    onPress={selectVideo} 
                                    disabled={videoUrl !== null || deletingVideo}
                                />
                                <Button 
                                    disabled={video === null || deletingVideo} 
                                    title="Tải video lên" 
                                    onPress={uploadVideo} 
                                />
                            </View>
                            {videoUrl && !deletingVideo && (
                                <Text style={{ color: 'green', marginTop: 5, textAlign: 'center' }}>
                                    Video đã được tải lên thành công
                                </Text>
                            )}
                        </View>
                    </View>
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Tình trạng <Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                selectedValue={selectedCondition}
                                onValueChange={(itemValue) => setSelectedCondition(itemValue)}
                            >
                                <Picker.Item label="Chọn tình trạng" value="" />
                                {conditions.map(condition => (
                                    <Picker.Item
                                        key={condition._id}
                                        label={condition.condition}
                                        value={condition._id}
                                    />
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
                                        {storageTypes.map(type => (
                                            <Picker.Item
                                                key={type._id}
                                                label={type.storageName}
                                                value={type._id}
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
                    <View className='flex-col gap-2'>
                        <Text className='font-bold text-[16px]'>Dung lượng pin<Text className='text-[#DC143C]'>*</Text>
                        </Text>
                        <TextInput
                            className='border-2 border-[#D9D9D9] rounded-lg px-2 py-5 font-semibold'
                            placeholder='Nhập dung lượng pin'
                            value={battery}
                            onChangeText={setBattery}
                        />
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
                                    {filteredStorages.map(storage => (
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
                                    <Picker.Item
                                        key={index}
                                        label={option.label}
                                        value={option.value}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View className='flex-col gap-2'>                        <Text className='font-bold text-[16px]'>Giá bán<Text className='text-[#DC143C]'>*</Text></Text>
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
                        <Text className='font-bold text-[16px]'>Tỉnh/Thành phố<Text className='text-[#DC143C]'>*</Text></Text>
                        <View className='border-2 border-[#D9D9D9] rounded-lg'>
                            <Picker
                                selectedValue={selectedProvince}
                                onValueChange={handleProvinceChange}
                            >
                                <Picker.Item label="Chọn Tỉnh/Thành phố" value="" />
                                {provinces.map(province => (
                                    <Picker.Item
                                        key={province.code}
                                        label={province.name}
                                        value={province.code}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {selectedProvince && (
                        <View className='flex-col gap-2'>
                            <Text className='font-bold text-[16px]'>Quận/Huyện<Text className='text-[#DC143C]'>*</Text></Text>
                            <View className='border-2 border-[#D9D9D9] rounded-lg'>
                                <Picker
                                    selectedValue={selectedDistrict}
                                    onValueChange={handleDistrictChange}
                                >
                                    <Picker.Item label="Chọn Quận/Huyện" value="" />
                                    {districts.map(district => (
                                        <Picker.Item
                                            key={district.code}
                                            label={district.name}
                                            value={district.code}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}

                    {selectedDistrict && (
                        <View className='flex-col gap-2'>
                            <Text className='font-bold text-[16px]'>Phường/Xã<Text className='text-[#DC143C]'>*</Text></Text>
                            <View className='border-2 border-[#D9D9D9] rounded-lg'>
                                <Picker
                                    selectedValue={selectedWard}
                                    onValueChange={handleWardChange}
                                >
                                    <Picker.Item label="Chọn Phường/Xã" value="" />
                                    {wards.map(ward => (
                                        <Picker.Item
                                            key={ward.code}
                                            label={ward.name}
                                            value={ward.code}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}

                    {selectedWard && (
                        <View className='flex-col gap-2'>
                            <Text className='font-bold text-[16px]'>Địa chỉ chi tiết<Text className='text-[#DC143C]'>*</Text></Text>
                            <TextInput
                                className='border-2 border-[#D9D9D9] rounded-lg px-2 py-3'
                                placeholder='Nhập số nhà, tên đường...'
                                value={detailAddress}
                                onChangeText={handleDetailAddressChange}
                            />
                        </View>
                    )}

                    {selectedLocation && (
                        <View className='mt-2'>
                            <Text className='text-[#666666]'>
                                Địa chỉ đầy đủ: {selectedLocation}
                            </Text>
                        </View>
                    )}
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
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text className="font-bold text-[18px] text-[#fff]">
                                        {isEditMode ? 'Cập nhật tin' : 'Đăng tin'}
                                    </Text>
                                )}
                            </View>
                        </LinearGradient>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        </View>
    )
}

