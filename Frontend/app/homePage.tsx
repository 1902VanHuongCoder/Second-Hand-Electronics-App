import {
  Text,
  View,
  TouchableHighlight,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  Button,
  Alert
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState, useRef } from "react";
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
  userId: string;
}
import socket from '../utils/socket';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AppBarForHome from "@/components/AppBarForHome";
import rootURL from "@/utils/backendRootURL";

// Định nghĩa kiểu cho người dùng
interface User {
  _id: string;
  name: string; // Thêm các thuộc tính cần thiết khác
}

interface MessageProps {
  id: string,
  text: string,
  time: string,
  user: string,
}

interface Room {
  id: string;
  name: string;
  messages: MessageProps[];
  // Add other properties of Room if needed
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
  const [isPressed, setIsPressed] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [reportVisible, setReportVisible] = useState(false); // State để theo dõi trạng thái hiển thị menu báo cáo
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null); // Chỉ định kiểu cho selectedProductId
  const [selectedReason, setSelectedReason] = useState<string | null>(null); // State để lưu lý do đã chọn
  const checkAuth = useAuthCheck();
  const [products, setProducts] = useState<Product[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
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
        const response = await axios.get<Product[]>(`${rootURL}/api/home`);
        setProducts(response.data);
        setAllProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await axios.get<CategoryResponse>(`${rootURL}/api/allcategory`);
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
      const response = await axios.get<Product[]>(`${rootURL}/api/home`);
      setProducts(response.data);
      setAllProducts(response.data);
      setFilteredProductsByCategory(response.data); // Reset cả danh sách lọc
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };

  const getBrandsById = async (categoryId: string, categoryName: string) => {
    try {
      const response = await axios.get<Brand[]>(`${rootURL}/api/brands/${categoryId}`);
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


  const handleReasonSelect = async (reason: string) => {
    setSelectedReason(reason);

    if (!user) {
      showNotification("Vui lòng đăng nhập để báo cáo bài đăng", "error");
      setReportVisible(false);
      return;
    }

    // Kiểm tra token
    if (!user.token) {
      showNotification("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại", "error");
      setReportVisible(false);
      return;
    }

    // Kiểm tra xem người dùng có đang báo cáo chính mình không
    if (selectedProductId && user.id) {
      const selectedProduct = products.find(product => product.id === selectedProductId);
      if (selectedProduct && selectedProduct.userId === user.id) {
        showNotification("Bạn không thể báo cáo sản phẩm của chính mình", "error");
        setReportVisible(false);
        return;
      }
    }

    try {
      const response = await axios.post('http://10.0.2.2:5000/api/reports', {
        productId: selectedProductId,
        reason: reason,
        description: ''
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      showNotification("Báo cáo đã được gửi thành công", "success");
      setReportVisible(false);
    } catch (error: any) {
      // Xử lý lỗi một cách đơn giản hơn
      if (error.response && error.response.data && error.response.data.message) {
        showNotification(error.response.data.message, "error");
      } else {
        showNotification("Đã xảy ra lỗi khi gửi báo cáo", "error");
      }
      setReportVisible(false);
    }
  };

  const formatCurrency = (value: String) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      showNotification("error", "Vui lòng nhập thông tin tìm kiếm.");
      return;
    }
    router.push(`/searchResults?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleCreateChat = (receiverId: string, productId: string) => {
    if (user) {
      const senderId = user.id;
      if (senderId !== receiverId) {
        const roomCode = `${receiverId}-${senderId}-${productId}`;
        socket.emit("createRoom", receiverId, senderId, productId, roomCode);
        router.push({
          pathname: '/chat',
          params: {
            roomCode: roomCode,
          }
        });
      }
    } else {
      showNotification("User not logged in", "error");
    }
  };

  useLayoutEffect(() => {
    if (user) {
      socket.auth = { userId: user.id, userName: user.name };
      socket.connect();
    }
  }, [user]);

  const fetchProductsByBrand = async (brandId: string) => {
    try {
      const response = await axios.get<Product[]>(`http://10.0.2.2:5000/api/home/getAllProductByBrands/${brandId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products by brand:", error);
    }
  };

  const filterByPrice = (min: number, max: number) => {
    const sourceProducts = filteredProductsByCategory.length > 0 ? filteredProductsByCategory : allProducts;
    const filtered = sourceProducts.filter(product => product.price >= min && product.price <= max);
    setProducts(filtered);
  };

  return (
    <View className="relative" style={{ flex: 1 }}>
      <Notification message={notifications.message} type={notifications.type} visible={notifications.visible} />
      <AppBarForHome />
      <View className="w-full px-4 flex flex-row items-center border-b-[1px] mt-6 pb-6 border-[#D9D9D9]">
        <TextInput
          className="border-2 border-[#D9D9D9] w-[69%] px-2 py-4 text-[#000] rounded-lg font-semibold"
          onChangeText={setSearchTerm}
          value={searchTerm}
          placeholder="Tìm kiếm ..."
        />
        <TouchableHighlight
          onPress={handleSearch}
          className="bg-[#9661D9] px-5 py-4 grow-1 rounded-lg flex items-center justify-center w-[29%] ml-[2%]"
          underlayColor="rgba(0,0,0,.2)" // Light red when pressed
        >
          <Text className="text-[#fff] font-semibold text-[16px] text-center">
            Tìm kiếm
          </Text>
        </TouchableHighlight>
      </View>
      <ScrollView className="px-4 shadow-inner">
        <LinearGradient
          colors={['#523471', '#9C62D7']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={{ padding: 12, borderRadius: 10, marginTop: 20 }}
          className="flex-row items-center justify-between px-6"
        >
          <View className="w-[50%]">
            <Text className="uppercase font-extrabold text-white text-4xl">
              2Hand Market
            </Text>
            <Text className="text-md text-white font-medium">
              Trao đổi mua bán điện thoại - laptop đã qua sử dụng.
            </Text>

          </View>
          <Image
            style={{ width: 150, height: 150 }}
            source={require("../assets/images/image 2.png")}
          />
        </LinearGradient>
        <View className="flex-row gap-4 mt-6 items-center justify-center">
          <TouchableHighlight underlayColor="#D9D9D9" onPress={() => getAllProducts()} className="border-[1px] border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center">
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="logo-slack" className="text-[]" size={22} color="#9661D9" />
              <Text className="font-bold text-[18px] text-black">Tất cả</Text>
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
                className="border-[1px] border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <Icon name={iconName} size={24} color="#9661D9" />
                  <Text className="font-bold text-[18px] text-black">
                    {category.categoryName}
                  </Text>
                </View>
              </TouchableHighlight>
            );
          })}
        </View>
        {brands.length > 0 && (
          <View className="mt-4 border-b-[1px] border-solid border-[#D9D9D9] pb-4">
            <Text className="font-bold text-[18px] mb-2 text-gray-500">Hãng của thiết bị</Text>
            <ScrollView horizontal className="flex-row gap-4">
              <View className="flex flex-row gap-4 justify-center items-center">
                {brands.map((brand) => (
                  <TouchableHighlight
                    onPress={() => fetchProductsByBrand(brand._id)}
                    underlayColor="#D9D9D9"
                    key={brand._id}
                    className="border-[1px] border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center"
                  >
                    <Text className="font-bold text-[18px] text-black">
                      {brand.brandName}
                    </Text>
                  </TouchableHighlight>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        <View className="mt-4 border-b-[1px] border-solid border-[#D9D9D9] pb-4">
          <Text className="font-bold text-[18px] mb-2 text-gray-500">Lọc theo giá</Text>
          <ScrollView horizontal className="flex-row gap-4">
            <View className="flex flex-row gap-4 justify-center items-center">
              {priceRanges.map((range, index) => (
                <TouchableHighlight
                  key={index}
                  underlayColor="#D9D9D9"
                  onPress={() => filterByPrice(range.min, range.max)}
                  className="border-[1px] border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center"
                >
                  <Text className="font-bold text-[16px] text-black">{range.label}</Text>
                </TouchableHighlight>
              ))}
            </View>
          </ScrollView>
        </View>
        {products.length > 0 ? (
          products.map((product, index) => (
            <View
              key={index}
              className={`w-full max-w-screen mt-6 flex-col gap-4 [&:not(:last-child)]:border-b-[1px] border-none border-b border-[#D9D9D9] pb-4 `}
            >
              <View className="flex flex-col w-full gap-y-5">
                <View className="flex-row w-full">
                  <View className="w-fit h-fit rounded-md overflow-hidden w-[33%]">
                    <Link href={`/postDetails?id=${product.id}`}>
                      <Image
                        style={{ width: 170, height: 170 }}
                        source={{ uri: product.images[0] }}
                      />
                    </Link>
                  </View>
                  <View className="w-[65%] ml-[2%] flex flex-col gap-3 flex-wrap">
                    <View className="flex-row items-center justify-between">
                      <Link href={`/postDetails?id=${product.id}`}>
                        <Text numberOfLines={1} ellipsizeMode="tail" className="font-bold text-[18px] uppercase inline max-w-full line-clamp-2">{product.title.length > 32 ? product.title.substring(0, 32) + "..." : product.title}</Text>
                      </Link>
                      <TouchableHighlight onPress={() => handleReportPress(product.id)} 
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: isPressed ? "green" : "transparent", // Change background on click
                        }}
                        underlayColor="rgba(0,0,0,.2)" // Light red when pressed
                        >
                        <Icon name="ellipsis-v" size={18} color="#9661D9" />
                      </TouchableHighlight>
                    </View>
                    {product.description ? <Text className="text-[16px]">{product.description.length > 35 ? product.description.substring(0, 35) + "..." : product.description}</Text> : <Text className="text-[16px]">{product.configuration ? product.configuration.length > 35 ? product.configuration.substring(0, 35) + "..." : product.configuration : ""}</Text>}
                    <Text className="font-bold text-[#9661D9] text-[20px]">
                      {formatCurrency(product.price.toString())} đ
                    </Text>
                    <View className="flex-row gap-2 items-center">
                      {/* <Icon name="map-marker" size={20} color="#9661D9" /> */}
                      <Text className="text-[16px] w-full">
                        {product.address}
                      </Text>
                    </View>
                    <View className="flex-row gap-2 items-center">
                      <Icon name="clock-o" size={20} color="#9661D9" />
                      <Text className="text-[16px]">
                        {new Date(product.postingDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row pr-4 justify-between items-center w-full">
                  <View className="flex-row gap-2 items-center">
                    <Image
                      source={product.avatarUrl ? { uri: product.avatarUrl } : require("../assets/images/avatar.jpg")}
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                    <View >
                      <Text className="font-medium text-[14px]">Người bán</Text>
                      <Text className="font-bold text-[16px]">
                        {product.nameUser}
                      </Text>
                    </View>
                  </View>
                  <TouchableHighlight className={`${product.userId !== user?.id ? 'block' : 'hidden'}`} underlayColor='#fff' onPress={() => product.nameUser && handleCreateChat(product.userId, product.id)}>
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
          ))
        ) : (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-gray-500 text-[16px] font-bold">
              Không có sản phẩm phù hợp
            </Text>
            <Image className="w-48 h-48" source={require('../assets/images/cute-shiba-inu-dog-sleeping-with-coffee-blanket-cartoon-vector-icon-illustration-animal-nature.png')} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
})