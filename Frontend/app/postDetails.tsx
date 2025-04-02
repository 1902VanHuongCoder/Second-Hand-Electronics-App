import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, Image, Pressable, ToastAndroid, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthCheck } from '../store/checkLogin';
import { Video, ResizeMode } from 'expo-av';
import socket from '@/utils/socket';
import * as Clipboard from 'expo-clipboard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { NotificationContext } from '@/context/NotificationContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import rootURL from "@/utils/backendRootURL";

// Định nghĩa kiểu cho sản phẩm
interface Product {
  id: string;
  title: string;
  configuration: string;
  price: number;
  address: string;
  postingDate: string;
  battery: string;
  nameUser: string | null;
  isPhoneHidden: boolean;
  versionName: string | null;
  brandName: string;
  type: 'laptop' | 'phone';
  ramCapacity?: string | null;
  cpuName?: string | null;
  gpuName?: string | null;
  screenSize?: string | null;
  storageCapacity?: string | null;
  storageType?: string | null;
  video: string | null;
  images: string[];
  userId: string;
  phone: string; // Số điện thoại người bán
}

const { width } = Dimensions.get("window");

export default function PostDetailsScreen() {
  const [product, setProduct] = useState<Product | null>(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const { showNotification } = useContext(NotificationContext);
  const { id } = useLocalSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const checkAuth = useAuthCheck();
  const [expanded, setExpanded] = useState(false);

  const handleChatWithSeller = (receiverId: string, productId: string) => {
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

  const handleCopyToClipboard = (phoneNumber: string) => {
    Clipboard.setStringAsync(phoneNumber);

    // Show confirmation message
    if (Platform.OS === 'android') {
      ToastAndroid.show('Số điện thoại đã được sao chép!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Thông báo', 'Số điện thoại đã được sao chép!');
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${rootURL}/api/products/details/${id}`);
        setProduct(response.data as Product);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const formatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  if (!product) {
    return (
      <View className='w-screen h-full flex justify-center items-center'>
        <Text >Loading...</Text>; // Hiển thị loading khi đang lấy dữ liệu
      </View>
    )
  }

  const media: { type: 'image' | 'video'; uri: string }[] = [
    ...product.images.map((image) => ({ type: 'image' as const, uri: image })),
    ...(product.video ? [{ type: 'video' as const, uri: product.video }] : []),
  ];

  return (
    <ScrollView style={styles.container}>
      <MediaCarousel data={media} />
      {showPhoneNumber && (
        <View className='absolute inset-0 z-10 w-full h-full bg-[rgba(0,0,0,.5)] flex justify-center items-center'>
          <View className='w-[90%] h-fit bg-white rounded-md flex justify-center items-start gap-y-5 p-10'>
            <Text className='text-[18px]'>Số điện thoại người bán</Text>
            <View className='flex items-center justify-between flex-row w-full'>
              <Text className='text-2xl font-bold text-[#9661D9]'>{product.phone}</Text>
              <View className='flex flex-row gap-x-5'>
                <TouchableOpacity className='px-4 py-2 bg-[rgba(0,0,0,.1)] rounded-md flex flex-row items-center' onPress={() => handleCopyToClipboard(product.phone)}>
                  <AntDesign name="copy1" size={24} color="black" /> <Text> Sao chép số</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowPhoneNumber(false)} className='px-4 py-2 border-[1px] border-solid border-[rgba(0,0,0,.1)] rounded-md flex flex-row items-center'>
                  <AntDesign name="close" size={24} color="black" /> <Text>Đóng</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </View>
      )}
      <View style={styles.content}>
        <Text className="uppercase" style={styles.postName} >{product.title}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)} đ</Text>
        <Text style={styles.location} className='font-bold'>Địa chỉ: <Text className='font-normal'>{product.address}</Text></Text>
        <Text style={styles.location} className='font-bold'>Ngày đăng: <Text className='font-normal'>{new Date(product.postingDate).toLocaleDateString()}</Text></Text>
        <Text style={styles.location} className='font-bold'>Phiên bản: <Text className='font-normal'>{product.versionName || 'Chưa có phiên bản'}</Text></Text>
        <Text style={styles.location} className='font-bold'>Thương hiệu: <Text className='font-normal'>{product.brandName || 'Chưa có thương hiệu'}</Text></Text>
        <Text style={styles.location} className='font-bold uppercase'>Mô tả chi tiết</Text>
        <View>
          <Text style={styles.description} numberOfLines={expanded ? undefined : 3}>
            {expanded ? product.configuration : product.configuration.substring(0, 120) + " ..."}
          </Text>

          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.expandText}>
              {expanded ? "Thu gọn" : "Xem thêm"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.specs} className='font-bold uppercase'>Thông số kỹ thuật</Text>
        {product.type === 'laptop' && (
          <View style={styles.specsContainer}>
            <View style={styles.specItem}>
              <Ionicons name="hardware-chip-outline" size={24} color="black" />
              <Text style={styles.specText}>
                <Text style={{ fontWeight: 'bold' }}>CPU: </Text>
                {product.cpuName}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="at-sharp" size={24} color="black" />
              <Text style={styles.specText}>
                <Text style={{ fontWeight: 'bold' }}>RAM: </Text>
                {product.ramCapacity}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="disc-outline" size={24} color="black" />
              <Text style={styles.specText}>
                <Text style={{ fontWeight: 'bold' }}>Dung lượng bộ nhớ: </Text>
                {product.storageCapacity} ({product.storageType})
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="laptop-outline" size={24} color="black" />
              <Text style={styles.specText}>
                <Text style={{ fontWeight: 'bold' }}>Màn hình: </Text>
                {product.screenSize}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="battery-charging-outline" size={24} color="black" />
              <Text style={styles.specText}>
                <Text style={{ fontWeight: 'bold' }}>Dung lượng bộ pin: </Text>
                {product.battery}
              </Text>
            </View>
          </View>
        )}

        {product.type === 'phone' && (
          <View style={styles.specsContainer}>
            <View style={styles.specItem}>
              <Ionicons name="at-sharp" size={24} color="black" />
              <Text style={styles.specText}>
                <Text style={{ fontWeight: 'bold' }}>RAM: </Text>
                {product.ramCapacity}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="disc-outline" size={24} color="black" />
              <Text style={styles.specText}>
                <Text style={{ fontWeight: 'bold' }}>Dung lượng bộ nhớ: </Text>
                {product.storageCapacity}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="battery-charging-outline" size={24} color="black" />
              <Text style={styles.specText}>
                <Text style={{ fontWeight: 'bold' }}>Dung lượng pin: </Text>
                {product.battery}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer} className={`${product.userId === user?.id ? 'hidden' : 'flex'}`}>
          <TouchableOpacity style={[
            styles.buttonWrapper,
            product.isPhoneHidden ? { width: '100%' } : { width: '48%' }
          ]} onPress={checkAuth}>
            <LinearGradient
              colors={['rgba(156,98,215,1)', 'rgba(82,52,113,1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
              <TouchableOpacity onPress={() => handleChatWithSeller(product.userId, product.id)}><Text style={styles.buttonText} >NHẮN TIN</Text></TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={[
            styles.buttonWrapper,
            product.isPhoneHidden ? { display: 'none' } : { width: '48%' }
          ]} onPress={() => setShowPhoneNumber(true)}>
            <LinearGradient
              colors={['rgba(156,98,215,1)', 'rgba(82,52,113,1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Ionicons name="call-outline" size={24} color="white" />
              <Text style={styles.buttonText}>GỌI ĐIỆN</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

interface MediaItem {
  type: 'image' | 'video';
  uri: string;
}

interface MediaCarouselProps {
  data: MediaItem[];
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ data }) => {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item }: { item: MediaItem }) => {
    return (
      <View style={styles.itemContainer}>
        {item.type === 'image' ? (
          <Image source={{ uri: item.uri }} style={styles.image} resizeMode="contain" />
        ) : (
          <Video
            source={{ uri: item.uri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
          />
        )}
      </View>
    );
  };

  const handleNext = () => {
    if (activeIndex < data.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: activeIndex - 1 });
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <View className='py-5'>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
      />
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dotStyle,
              { opacity: index === activeIndex ? 1 : 0.4 },
            ]}
          />
        ))}
      </View>
      <View style={styles.navigateButton}>
        <TouchableOpacity style={styles.navigateButtonFlatList} onPress={handlePrev}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigateButtonFlatList} onPress={handleNext}>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: width,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '100%',
    borderRadius: 10,
  },
  video: {
    width: '90%',
    height: '100%',
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  slide: {
    width: width,
    height: 200,
  },
  content: {
    padding: 20,
    borderTopColor: '#D9D9D9',
    borderTopWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9661D9',
    marginVertical: 10,
  },
  location: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
    marginVertical: 10,
  },
  specs: {
    fontSize: 16,
    marginVertical: 10,
    borderTopColor: '#D9D9D9',
    borderTopWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 10,
    paddingTop: 30,
  },
  specsContainer: {
    marginTop: 1,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  specText: {
    marginLeft: 10,
    fontSize: 16,
  },
  navigateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '50%',
    width: '100%',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 10,
  },
  navigateButtonFlatList: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 40,
    padding: 10,
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  expandText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#9661D9',
    fontWeight: 600
  },
  expandedText: {
    fontSize: 16,
    marginVertical: 10,
  },
  postName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily: 'Knewave',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 18,
    marginTop: 20,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: 'rgba(99, 95, 95, 0.92)',
  },
});