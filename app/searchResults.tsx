import {
    Text,
    View,
    TouchableHighlight,
    Image,
    ScrollView,
    StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Định nghĩa kiểu cho sản phẩm
interface Product {
    id: string;
    title: string;
    configuration: string;
    price: number;
    address: string;
    postingDate: string;
    nameUser: string | null;
    brandName: string;
    type: 'laptop' | 'phone';
    ramCapacity?: string | null;
    cpuName?: string | null;
    gpuName?: string | null;
    screenSize?: string | null;
    storageCapacity?: string | null;
    storageType?: string | null;
}

// Định nghĩa kiểu cho sản phẩm từ API
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
        name: string;
    };
    images: string[];
    configuration: string;
}

// Hàm chuyển đổi từ ProductResponse sang Product
const mapApiResponseToProduct = (apiProduct: ProductResponse): Product => {
    return {
        id: apiProduct._id,
        title: apiProduct.title,
        configuration: apiProduct.configuration,
        price: apiProduct.price,
        address: apiProduct.location.fullAddress,
        postingDate: apiProduct.createdAt,
        nameUser: apiProduct.userId?.name || null,
        brandName: "", // Set default values for optional fields
        type: "phone", // Set default type
        ramCapacity: null,
        cpuName: null,
        gpuName: null,
        screenSize: null,
        storageCapacity: null,
        storageType: null
    };
};

export default function SearchResults() {
    const router = useRouter();
    const { searchTerm } = useLocalSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ProductResponse[]>(`http://10.0.2.2:5000/api/products/search?searchTerm=${searchTerm}`);
                const mappedProducts = response.data.map(mapApiResponseToProduct);
                setProducts(mappedProducts);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        if (searchTerm) {
            fetchSearchResults();
        }
    }, [searchTerm]);

    const formatCurrency = (value: string) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableHighlight onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#9661D9" />
                </TouchableHighlight>
                <Text style={styles.headerTitle}>Kết quả tìm kiếm: {searchTerm}</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text>Đang tải...</Text>
                </View>
            ) : products.length === 0 ? (
                <View style={styles.noResults}>
                    <Text>Không tìm thấy sản phẩm nào</Text>
                </View>
            ) : (
                <ScrollView>
                    {products.map((product) => (
                        <View key={product.id} style={styles.productCard}>
                            <View style={styles.productContent}>
                                <View style={styles.imageAndDetails}>
                                    <Link href={`/postDetails?id=${product.id}`}>
                                        <Image
                                            style={styles.productImage}
                                            source={require("../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg")}
                                        />
                                    </Link>
                                    <View style={styles.productDetails}>
                                        <Link href={`/postDetails?id=${product.id}`}>
                                            <Text style={styles.productTitle}>{product.title}</Text>
                                        </Link>
                                        <Text style={styles.configuration}>{product.configuration}</Text>
                                        <Text style={styles.price}>
                                            {formatCurrency(product.price.toString())} đ
                                        </Text>
                                        <View style={styles.locationContainer}>
                                            <Icon name="map-marker" size={20} color="#9661D9" />
                                            <Text style={styles.address}>{product.address}</Text>
                                        </View>
                                        <View style={styles.dateContainer}>
                                            <Icon name="clock-o" size={20} color="#9661D9" />
                                            <Text style={styles.date}>
                                                {new Date(product.postingDate).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.sellerInfo}>
                                    <View style={styles.sellerDetails}>
                                        <Image
                                            style={styles.sellerAvatar}
                                            source={require("../assets/images/z6186705977978_00edd678a64db50dba5ef61a50391611.jpg")}
                                        />
                                        <View>
                                            <Text style={styles.sellerLabel}>Người bán</Text>
                                            <Text style={styles.sellerName}>{product.nameUser}</Text>
                                        </View>
                                    </View>
                                    <TouchableHighlight>
                                        <Ionicons name="chatbubbles-outline" size={30} color="#9661D9" />
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResults: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productCard: {
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
        paddingBottom: 16,
        marginBottom: 16,
    },
    productContent: {
        gap: 16,
    },
    imageAndDetails: {
        flexDirection: 'row',
        gap: 12,
    },
    productImage: {
        width: 170,
        height: 170,
    },
    productDetails: {
        flex: 1,
        gap: 4,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    configuration: {
        fontSize: 12,
        color: '#666',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#9661D9',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    address: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    date: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    sellerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sellerDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sellerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    sellerLabel: {
        fontSize: 14,
        color: '#666',
    },
    sellerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 