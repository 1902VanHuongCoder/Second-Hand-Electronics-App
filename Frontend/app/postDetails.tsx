import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useAuthCheck } from '../store/checkLogin';
import { Video, ResizeMode } from 'expo-av';

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
}

const { width } = Dimensions.get("window");


export default function PostDetailsScreen() {
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useLocalSearchParams();

  const checkAuth = useAuthCheck();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:5000/api/products/details/${id}`);
        setProduct(response.data as Product);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const formatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // const getDisplayAddress = (product: Product) => {
  //   if (typeof product.location === 'object' && product.location?.fullAddress) {
  //     return product.location.fullAddress;
  //   }
  //   if (typeof product.location === 'string') {
  //     return product.location;
  //   }
  //   return product.address || 'Chưa có địa chỉ';
  // };

  if (!product) {
    return <Text>Loading...</Text>; // Hiển thị loading khi đang lấy dữ liệu
  }

  const media: { type: 'image' | 'video'; uri: string }[] = [
    ...product.images.map((image) => ({ type: 'image' as const, uri: image })),
    ...(product.video ? [{ type: 'video' as const, uri: product.video }] : []),
  ];

  return (
    <ScrollView style={styles.container}>
      <MediaCarousel data={media} />
      <View style={styles.content}>
        <Text style={styles.postName}>{product.title}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)} đ</Text>
        <Text style={styles.location}>Địa chỉ: {product.address}</Text>
        <Text style={styles.location}>Ngày đăng: {new Date(product.postingDate).toLocaleDateString()}</Text>
        <Text style={styles.location}>Phiên bản: {product.versionName || 'Chưa có phiên bản'}</Text>
        <Text style={styles.location}>Thương hiệu: {product.brandName || 'Chưa có thương hiệu'}</Text>
        <Text style={styles.location} className='font-bold uppercase'>Mô tả chi tiết</Text>
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.expandText}>
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </Text>
        </TouchableOpacity>
        {expanded && (
          <Text style={styles.expandedText} className='text-justify'>
            {<Text style={styles.description}>{product.configuration}</Text>}
          </Text>
        )}
        <Text style={styles.specs} className='font-bold uppercase'>Thông số kỹ thuật</Text>
        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Ionicons name="hardware-chip-outline" size={24} color="black" className='font-bold' />
            <Text style={styles.specText} className='font-bold'>CPU: <Text className='font-normal'>{product.cpuName}</Text></Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="at-sharp" size={24} color="black" />
            <Text style={styles.specText} className='font-bold'>RAM: <Text className='font-normal'>{product.ramCapacity}</Text></Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="disc-outline" size={24} color="black" />
            <Text style={styles.specText} className='font-bold'>Storage: <Text className='font-normal'>{product.storageCapacity} ({product.storageType})</Text></Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="laptop-outline" size={24} color="black" />
            <Text style={styles.specText} className='font-bold'>Display: <Text className='font-normal'>{product.screenSize}</Text></Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="battery-charging-outline" size={24} color="black" />
            <Text style={styles.specText} className='font-bold'>Battery: <Text className='font-normal'>{product.battery}</Text></Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
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
              <Text style={styles.buttonText}>NHẮN TIN</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={[
            styles.buttonWrapper,
            product.isPhoneHidden ? { display: 'none' } : { width: '48%' }
          ]} onPress={checkAuth}>
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
          <Image source={{ uri: item.uri }} style={styles.image} />
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
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
      // showsHorizontalScrollIndicator={true}
      // // onMomentumScrollEnd={(event) => {
      // //   const index = Math.floor(event.nativeEvent.contentOffset.x / width);
      // //   setActiveIndex(index);
      // // }}
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
  },
  details: {
    fontSize: 16,
    marginVertical: 10,
  },
  specs: {
    fontSize: 16,
    marginVertical: 10,
    borderTopColor: '#D9D9D9',
    borderTopWidth: 2,
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
    borderRadius: 20,
    padding: 10,
  },
  navigateButtonFlatList: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
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
    color: 'blue',
    textAlign: 'center',
  },
  expandedText: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 600
  },
  postName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily: 'Knewave',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: 'rgba(99, 95, 95, 0.92)',
  },
});