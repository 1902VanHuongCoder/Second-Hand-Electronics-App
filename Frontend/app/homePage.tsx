import {
  Text,
  View,
  TouchableHighlight,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { NotificationContext } from "@/context/NotificationContext";
import { useAuthCheck } from '../store/checkLogin';
import Notification from '../components/Notification';
// Định nghĩa kiểu cho sản phẩm
interface Product {
  id: string;
  title: string;
  configuration: string;
  price: number;
  address: string;
  description: string;
  postingDate: string;
  nameUser: string | null;
  brandName: string; // Lấy brandName từ brand
  type: 'laptop' | 'phone'; // Cập nhật để bao gồm cả loại điện thoại
  ramCapacity?: string | null; // Thêm ramCapacity
  cpuName?: string | null; // Thêm cpuName
  gpuName?: string | null; // Thêm gpuName
  screenSize?: string | null; // Thêm screenSize
  storageCapacity?: string | null; // Thêm storageCapacity
  storageType?: string | null; // Thêm storageType// Sẽ sử dụng fullAddress từ backend
  images: string[];
  avatarUrl: string;
}

// Định nghĩa kiểu cho người dùng
interface User {
  _id: string;
  name: string; // Thêm các thuộc tính cần thiết khác
}

interface Category {
  _id: string;
  categoryName: string;
}

interface CategoryResponse {
  categories: Category[];
}

interface Brand {
  _id: string;
  brandName: string;
}

export default function HomePage() {
  const router = useRouter();
  const { notifications, showNotification } = useContext(NotificationContext);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [reportVisible, setReportVisible] = useState(false); // State để theo dõi trạng thái hiển thị menu báo cáo
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null); // Chỉ định kiểu cho selectedProductId
  const [selectedReason, setSelectedReason] = useState<string | null>(null); // State để lưu lý do đã chọn
  const checkAuth = useAuthCheck();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategory] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredProductsByCategory, setFilteredProductsByCategory] = useState<Product[]>([]);
  const checkLogin = () => {
    checkAuth();
  }

  const priceRanges = [
    { label: "Dưới 5 triệu", min: 0, max: 5000000 },
    { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
    { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
    { label: "Trên 20 triệu", min: 20000000, max: Infinity }
  ];


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('http://10.0.2.2:5000/api/home');
        setProducts(response.data);
        setAllProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await axios.get<CategoryResponse>('http://10.0.2.2:5000/api/allcategory');
        setCategory(response.data.categories);

      } catch (err) {
        console.log("Error fetching category: ", err)
      }
    }

    fetchCategory();
    fetchProducts();
  }, []);

  const reportReasons = [
    "Nội dung không phù hợp",
    "Hàng giả, hàng nhái",
    "Lừa đảo",
    "Spam",
    "Khác",
  ];

  const getAllProducts = async () => {
    setBrands([]);
    try {
      const response = await axios.get<Product[]>('http://10.0.2.2:5000/api/home');
      setProducts(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };

  const getBrandsById = async (categoryId: string, categoryName: string) => {
    try {
      const response = await axios.get<Brand[]>(`http://10.0.2.2:5000/api/brands/${categoryId}`);
      setBrands(response.data);

      let filteredProducts = allProducts;
      if (categoryName.toLowerCase().includes("điện thoại")) {
        filteredProducts = allProducts.filter(product => product.type === "phone");
      } else if (categoryName.toLowerCase().includes("laptop")) {
        filteredProducts = allProducts.filter(product => product.type === "laptop");
      }

      setFilteredProductsByCategory(filteredProducts);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };


  const handleReportPress = (productId: string) => {
    checkLogin();
    setSelectedProductId(productId);
    setReportVisible(!reportVisible);
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    alert(`Bạn đã chọn lý do: ${reason}`);
  };

  const formatCurrency = (value: String) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      showNotification("Vui lòng nhập từ khóa tìm kiếm", "error");
      return;
    }
    router.push(`/searchResults?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
  };

  const fetchProductsByBrand = async (brandId: string) => {
    try {
      const response = await axios.get<Product[]>(`http://10.0.2.2:5000/api/home/getAllProductByBrands/${brandId}`);
      setProducts(response.data);
      console.log(response.data[0].id)
    } catch (error) {
      console.error("Error fetching products by brand:", error);
    }
  };

  const filterByPrice = (min: number, max: number) => {
    const filtered = filteredProductsByCategory.filter(product => product.price >= min && product.price <= max);
    setProducts(filtered);
  };


  return (
    <View className="p-4 relative" style={{ flex: 1 }}>
      <View className="flex-row justify-between items-center border-b-2 pb-6 pt-2 border-[#D9D9D9]">
        <TextInput
          className="border-2 border-[#D9D9D9] w-2/3 px-2 py-4 text-[#000] rounded-lg font-semibold"
          onChangeText={setSearchTerm}
          value={searchTerm}
          placeholder="Tìm kiếm ..."
        />
        <TouchableHighlight
          onPress={handleSearch}
          className="bg-[#9661D9] px-5 py-4 rounded-lg flex items-center justify-center"
        >
          <Text className="text-[#fff] font-semibold text-[16px] text-center">
            Tìm kiếm
          </Text>
        </TouchableHighlight>
      </View>
      <ScrollView className="">
        <LinearGradient
          colors={['#523471', '#9C62D7']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={{ padding: 12, borderRadius: 10, marginTop: 20 }}
          className="flex-row items-center justify-between"
        >
          <View className="w-[50%]">
            <Text className="uppercase font-extrabold text-white text-[18px]">
              2Hand Market
            </Text>
            <Text className="text-[14px] text-white font-medium">
              Buôn bán các thiết bị hiện tại và uy tính.
            </Text>
          </View>
          <Image
            style={{ width: 150, height: 150 }}
            source={require("../assets/images/image 2.png")}
          />
        </LinearGradient>
        <View className="flex-row gap-4 mt-6 items-center justify-center">
          <TouchableHighlight underlayColor="#D9D9D9" onPress={() => getAllProducts()} className="border-2 border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center">
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="logo-slack" className="text-[]" size={22} color="#9661D9" />
              <Text className="font-bold text-[18px] text-[#9661D9]">All</Text>
            </View>
          </TouchableHighlight>
          {categories.map((category) => {
            const iconName = category.categoryName === "Điện thoại" ? "mobile" :
              category.categoryName === "Laptop" ? "laptop" : "question-circle";
            return (
              <TouchableHighlight
                underlayColor="#D9D9D9"
                key={category._id}
                onPress={() => getBrandsById(category._id, category.categoryName)}
                className="border-2 border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <Icon name={iconName} size={24} color="#9661D9" />
                  <Text className="font-bold text-[18px] text-[#9661D9]">
                    {category.categoryName}
                  </Text>
                </View>
              </TouchableHighlight>
            );
          })}
        </View>
        {brands.length > 0 && (
          <View className="mt-4">
            <ScrollView horizontal className="flex-row gap-4">
              <View className="flex flex-row gap-4 justify-center items-center">
                {brands.map((brand) => (
                  <TouchableHighlight
                    onPress={() => fetchProductsByBrand(brand._id)}
                    underlayColor="#D9D9D9"
                    key={brand._id}
                    className="border-2 border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center"
                  >
                    <Text className="font-bold text-[18px] text-[#9661D9]">
                      {brand.brandName}
                    </Text>
                  </TouchableHighlight>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        <View className="mt-4">
          <Text className="font-bold text-[18px] mb-2">Lọc theo giá</Text>
          <ScrollView horizontal className="flex-row gap-4">
            <View className="flex flex-row gap-4 justify-center items-center">
              {priceRanges.map((range, index) => (
                <TouchableHighlight
                  key={index}
                  underlayColor="#D9D9D9"
                  onPress={() => filterByPrice(range.min, range.max)}
                  className="border-2 border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center"
                >
                  <Text className="font-bold text-[16px] text-[#9661D9]">{range.label}</Text>
                </TouchableHighlight>
              ))}
            </View>
          </ScrollView>
        </View>
        {products.map((product, index) => (
          <View
            key={index}
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
                  <Text className="text-[12px]">{product.description || product.configuration}</Text>
                  <Text className="font-bold text-[#9661D9] text-[16px]">
                    {formatCurrency(product.price.toString())} đ
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
                      {new Date(product.postingDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex-row justify-between items-center w-full">
                <View className="flex-row gap-2 items-center">
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
                <TouchableHighlight underlayColor='#fff' onPress={checkLogin}>
                  <Ionicons name="chatbubbles-outline" size={30} color="#9661D9" />
                </TouchableHighlight>
              </View>
            </View>
            {reportVisible && selectedProductId === product.id && ( // Hiển thị menu báo cáo nếu điều kiện thỏa mãn
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
      <Notification message={notifications.message} type={notifications.type} visible={notifications.visible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
})