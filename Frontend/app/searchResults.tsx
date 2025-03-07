import {
    Text,
    View,
    TouchableHighlight,
    Image,
    ScrollView,
    TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from 'axios';
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Product {
    id: string;
    title: string;
    configuration: string;
    price: number;
    address: string;
    postingDate: string;
    nameUser: string | null;
    avatarUrl: string,
    brandName: string;
    type: 'laptop' | 'phone';
    ramCapacity?: string | null;
    cpuName?: string | null;
    gpuName?: string | null;
    screenSize?: string | null;
    storageCapacity?: string | null;
    storageType?: string | null;
    images: string[];
}

// Định nghĩa kiểu cho response từ API
interface ProductResponse {
    _id: string;
    title: string;
    description: string;
    price: number;
    location: {
        fullAddress: string;
    };
    createdAt: string;
    userId: {
        _id: string;
        name: string;
        avatarUrl: string;
    };
    configuration: string;
    images: [string]
}

// Hàm chuyển đổi dữ liệu từ API sang định dạng Product
const mapApiResponseToProduct = (apiProduct: ProductResponse): Product => {
    return {
        id: apiProduct._id,
        title: apiProduct.title,
        images: apiProduct.images,
        configuration: apiProduct.configuration || '',
        price: apiProduct.price,
        address: apiProduct.location?.fullAddress || '',
        postingDate: new Date(apiProduct.createdAt).toLocaleDateString('vi-VN'),
        nameUser: apiProduct.userId?.name,
        avatarUrl: apiProduct.userId?.avatarUrl || '',
        brandName: '',
        type: 'phone',
        ramCapacity: null,
        cpuName: null,
        gpuName: null,
        screenSize: null,
        storageCapacity: null,
        storageType: null
    };
};

export default function SearchResults() {
    const [reportVisible, setReportVisible] = useState(false); // State để theo dõi trạng thái hiển thị menu báo cáo
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null); // Chỉ định kiểu cho selectedProductId
    const [selectedReason, setSelectedReason] = useState<string | null>(null); // State để lưu lý do đã chọn
    const { searchTerm } = useLocalSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);
    const reportReasons = [
        "Nội dung không phù hợp",
        "Hàng giả, hàng nhái",
        "Lừa đảo",
        "Spam",
        "Khác",
    ];

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get<ProductResponse[]>(`http://10.0.2.2:5000/api/products/search/ketquatimkiem?searchTerm=${searchTerm}`);
                const mappedProducts = response.data.map(mapApiResponseToProduct);
                setProducts(mappedProducts);
                console.log('tim kiem', mappedProducts)
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (searchTerm) {
            fetchSearchResults();
        }
    }, [searchTerm]);

    const handleReportPress = (productId: string) => {
        setSelectedProductId(productId);
        setReportVisible(!reportVisible);
    };

    const handleReasonSelect = (reason: string) => {
        setSelectedReason(reason);
        alert(`Bạn đã chọn lý do: ${reason}`);
    };

    const formatCurrency = (value: Number) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return (
        <View className="p-4 bg-white" style={{ flex: 1 }}>
            <View className="flex-col gap-4">
                <Text className="font-bold text-[16px]">Kết quả tìm kiếm với "{searchTerm}"</Text>
            </View>
            {products.length > 0 ? (
                <ScrollView>
                    {products.map((product) => (
                        <View
                            key={product.id}
                            className="mt-6 flex-col gap-4 border-b border-[#D9D9D9] pb-4"
                        >
                            <View className="flex-col gap-4">
                                <View className="flex-row gap-2 w-full">
                                    <Link href={`/postDetails?id=${product.id}`}>
                                        <Image
                                            style={{ width: 170, height: 170 }}
                                            source={{ uri: product.images[0] }}
                                        />
                                    </Link>
                                    <View className="w-[50%] flex-col gap-1">
                                        <View className="flex-row justify-between items-center">
                                            <Link href={`/postDetails?id=${product.id}`}>
                                                <Text className="font-bold text-[16px]">{product.title}</Text>
                                            </Link>
                                            <TouchableHighlight onPress={() => handleReportPress(product.id)}>
                                                <Icon name="ellipsis-v" size={18} color="#9661D9" />
                                            </TouchableHighlight>
                                        </View>
                                        <Text className="text-[12px]">{product.configuration}</Text>
                                        <Text className="font-bold text-[#9661D9] text-[16px]">
                                            {formatCurrency(product.price)} đ
                                        </Text>
                                        <View className="flex-row gap-2 items-center">
                                            <Icon name="map-marker" size={20} color="#9661D9" />
                                            <Text className="font-bold text-[14px]">
                                                {product.address}
                                            </Text>
                                        </View>
                                        <View className="flex-row gap-2 items-center">
                                            <Icon name="clock-o" size={20} color="#9661D9" />
                                            <Text className="font-bold text-[14px]">
                                                {product.postingDate}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="flex-row justify-between items-center w-full">
                                    <View className="flex-row gap-2">
                                        <Image
                                            source={product.avatarUrl ? { uri: product.avatarUrl } : require("../assets/images/avatar.jpg")}
                                            style={{ width: 50, height: 50, borderRadius: 25 }}
                                        />
                                        <View>
                                            <Text className="font-medium text-[14px]">Người bán</Text>
                                            <Text className="font-bold text-[16px]">
                                                {product.nameUser}
                                            </Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Icon name="comments" size={30} color="#9661D9" />
                                    </View>
                                </View>
                            </View>
                            {reportVisible && selectedProductId === product.id && (
                                <View className="bg-[#F4E9FF] p-4 rounded-lg mt-2">
                                    <Text className="text-[#000] font-bold text-[18px]">Chọn lý do báo cáo:</Text>
                                    {reportReasons.map((reason, index) => (
                                        <TouchableHighlight key={index} underlayColor="#9661D9" onPress={() => handleReasonSelect(reason)}>
                                            <Text className="text-[#9661D9] mt-2 text-[16px] font-medium">{reason}</Text>
                                        </TouchableHighlight>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500 text-[16px] font-bold">
                        Không có kết quả phù hợp với "{searchTerm}"
                    </Text>
                    <Image className="w-48 h-48" source={require('../assets/images/cute-shiba-inu-dog-sleeping-with-coffee-blanket-cartoon-vector-icon-illustration-animal-nature.png')} />
                </View>
            )}
        </View>
    );
}