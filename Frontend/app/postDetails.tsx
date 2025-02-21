import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from '@/components/Carousel';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { ParsedUrlQuery } from 'querystring';

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
  brandName: string; // Lấy brandName từ brand
  type: 'laptop' | 'phone'; // Cập nhật để bao gồm cả loại điện thoại
  ramCapacity?: string | null; // Thêm ramCapacity
  cpuName?: string | null; // Thêm cpuName
  gpuName?: string | null; // Thêm gpuName
  screenSize?: string | null; // Thêm screenSize
  storageCapacity?: string | null; // Thêm storageCapacity
  storageType?: string | null; // Thêm storageType
}

const { width: viewportWidth } = Dimensions.get('window');

export default function PostDetailsScreen() {
  const [product, setProduct] = useState<Product | null>(null); // Chuyển đổi kiểu router
  const { id } = useLocalSearchParams(); ; // Lấy ID từ query params
  
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

  if (!product) {
    return <Text>Loading...</Text>; // Hiển thị loading khi đang lấy dữ liệu
  }

  return (
    <ScrollView style={styles.container}>
      <Carousel />
      <Image
        style={styles.image}
        source={require("../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg")}// Giả sử bạn có một mảng images
      />
      <View style={styles.content}>
        <Text style={styles.postName}>{product.title}</Text>
        <Text style={styles.description}>{product.configuration}</Text>
        <Text style={styles.price}>{product.price} VND</Text>
        <Text style={styles.location}>Địa chỉ: {product.address}</Text>
        <Text style={styles.location}>Ngày đăng: {new Date(product.postingDate).toLocaleDateString()}</Text>
        <Text style={styles.location} className='font-bold uppercase'>Mô tả chi tiết</Text>
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.expandText}>
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </Text>
        </TouchableOpacity>
        {expanded && (
          <Text style={styles.expandedText} className='text-justify'>
            {}
          </Text>
        )}
        <Text style={styles.specs} className='font-bold uppercase'>Thông số kỹ thuật</Text>
        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Ionicons name="hardware-chip-outline" size={24} color="black" className='font-bold'/>
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
          <Pressable style={styles.buttonWrapper}>
            <LinearGradient
              colors={['rgba(156,98,215,1)', 'rgba(82,52,113,1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button} 
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
             <Link href="/chat"><Text style={styles.buttonText}>NHẮN TIN</Text></Link> 
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.buttonWrapper}>
            <LinearGradient
              colors={['rgba(156,98,215,1)', 'rgba(82,52,113,1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Ionicons name="call-outline" size={24} color="white"/>
              <Text style={styles.buttonText}>GỌI ĐIỆN</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    width: viewportWidth,
    height: 200,
  },
  image: {
    width: '100%',
    height: 400,
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 6,
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 40,
    borderRadius: 5,
    paddingVertical: 10,
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
    fontFamily: 'Knewave',
  },
  postName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily: 'Knewave',
  },
});

