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

export default function HomePage() {
  const router = useRouter();
  const { notifications, showNotification } = useContext(NotificationContext);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [reportVisible, setReportVisible] = useState(false); // State để theo dõi trạng thái hiển thị menu báo cáo
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null); // Chỉ định kiểu cho selectedProductId
  const [selectedReason, setSelectedReason] = useState<string | null>(null); // State để lưu lý do đã chọn
  const checkAuth = useAuthCheck();
  const [products, setProducts] = useState<Product[]>([]);
  // const [users, setUsers] = useState<{ [key: string]: User }>({}); // Sử dụng kiểu User cho các giá trị
  const checkLogin = () => {
    checkAuth();
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('http://10.0.2.2:5000/api/home');

        console.log("Post data", response.data);
        
        setProducts(response.data);
        console.log(response.data)

        // Lấy thông tin người dùng cho từng sản phẩm
        // const userIds = response.data.map(product => product.userId);
        // const uniqueUserIds = [...new Set(userIds)]; // Lấy danh sách userId duy nhất

        // const userResponses = await Promise.all(
        //   uniqueUserIds.map(userId => axios.get<User>(`http://10.0.2.2:5000/api/users/${userId}`))
        // );

        // const usersData = userResponses.reduce<{ [key: string]: User }>((acc, userResponse) => {
        //   acc[userResponse.data._id] = userResponse.data; // Lưu thông tin người dùng theo userId
        //   return acc;
        // }, {});

        // setUsers(usersData); // Cập nhật state với thông tin người dùng

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const reportReasons = [
    "Nội dung không phù hợp",
    "Hàng giả, hàng nhái",
    "Lừa đảo",
    "Spam",
    "Khác",
  ];

  const handleReportPress = (productId: string) => {
    checkLogin();
    setSelectedProductId(productId);
    setReportVisible(!reportVisible); // Chuyển đổi trạng thái hiển thị menu báo cáo
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    alert(`Bạn đã chọn lý do: ${reason}`); // Thực hiện hành động báo cáo ở đây
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
          <TouchableHighlight className="border-2 border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center">
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="logo-slack" className="text-[]" size={22} color="#9661D9" />
              <Text className="font-bold text-[18px] text-[#9661D9]">All</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight className="border-2 border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center">
            <View className="flex-row items-center justify-center gap-2">
              <Icon name="mobile" size={24} color="#9661D9" />
              <Text className="font-bold text-[18px] text-[#9661D9]">
                Điện thoại
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight className="border-2 border-[#D9D9D9] px-4 py-3 rounded-lg flex items-center justify-center">
            <View className="flex-row items-center justify-center gap-2">
              <Icon name="laptop" size={22} color="#9661D9" />
              <Text className="font-bold text-[18px] text-[#9661D9]">Laptop</Text>
            </View>
          </TouchableHighlight>
        </View>
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
                    style={{ width: 50, height: 50 }}
                    className="rounded-full"
                    source={{uri: product.avatarUrl}} 
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

//npm install react-native-linear-gradient sử dụng này để gradient background
//npm install react-native-vector-icons cài icon

// const styles = StyleSheet.create({
//     container: {
//         padding: 16,
//     },
//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         padding: 16,
//         marginBottom: 16,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     cardContent: {
//         flexDirection: 'column',
//     },
//     title: {
//         fontWeight: 'bold',
//         fontSize: 18,
//     },
//     battery: {
//         fontSize: 14,
//         color: '#666',
//     },
//     ram: {
//         fontSize: 14,
//         color: '#666',
//     },
//     screen: {
//         fontSize: 14,
//         color: '#666',
//     },
//     productTitle: {
//         fontWeight: 'bold',
//         fontSize: 16,
//         marginTop: 8,
//     },
//     description: {
//         fontSize: 14,
//         color: '#333',
//     },
//     price: {
//         fontWeight: 'bold',
//         fontSize: 16,
//         color: '#9661D9',
//         marginTop: 4,
//     },
//     loading: {
//         textAlign: 'center',
//         marginTop: 20,
//         fontSize: 16,
//         color: '#999',
//     },
// });