import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { LinearGradient } from 'expo-linear-gradient';

const { width: viewportWidth } = Dimensions.get('window');

export default function PostDetailsScreen() {
  const navigation = useNavigation();
  const images = [
    'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
    'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
    'https://media.istockphoto.com/id/537692968/photo/capturing-the-beauty-of-nature.jpg?s=612x612&w=0&k=20&c=V1HaryvwaOZfq80tAzeVPJST9iPoGnWb8ICmE-lmXJA='
  ];

  const renderItem = ({ item }: { item: string }) => {
    return (
      <View style={styles.slide}>
        <Image source={{ uri: item }} style={styles.image} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Details</Text>
      </View>
      <Image source={require('@/assets/images/image 2.png')} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.postName}>Laptop gaming ASUS 16GB 256GB</Text>
        <Text style={styles.description}>This is a detailed description of the post. It provides all the necessary information about the post.</Text>
        <Text style={styles.price}>100 VND</Text>
        <Text style={styles.location}>Location: New York, USA</Text>
        <Text style={styles.location}>Time: 20:30 01/01/2025</Text>
        <Text style={styles.location}>Mô tả chi tiết</Text>
        <Text style={styles.details}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec faucibus orci at augue blandit euismod. Morbi et ex convallis, congue risus venenatis, efficitur magna. Pellentesque non nisi maximus, elementum sem at, gravida ligula. Integer dapibus arcu sit amet libero malesuada accumsan. Suspendisse vehicula fringilla accumsan. Nullam accumsan leo quis luctus blandit. Mauris dapibus vitae eros ac accumsan...</Text>
        <Text style={styles.specs}>Thông số kỹ thuật</Text>
        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Ionicons name="hardware-chip-outline" size={24} color="black" />
            <Text style={styles.specText}>CPU: Intel Core i7</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="at-sharp" size={24} color="black" />
            <Text style={styles.specText}>RAM: 16GB</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="disc-outline" size={24} color="black" />
            <Text style={styles.specText}>Storage: 256GB SSD</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="laptop-outline" size={24} color="black" />
            <Text style={styles.specText}>Display: 15.6" FHD</Text>
          </View>
        </View>
        <View className='flex flex-row justify-between mt-5 gap-x-5'>
          <Pressable >
            <LinearGradient
              colors={['rgba(156,98,215,1)', 'rgba(82,52,113,1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button} 
            >
               <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>NHẮN TIN</Text>
            </LinearGradient>
          </Pressable>
          <Pressable className=''>
            <LinearGradient
              colors={['rgba(156,98,215,1)', 'rgba(82,52,113,1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Ionicons name="call-outline" size={24} color="white"/>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>GỌI ĐIỆN</Text>
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
  postName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
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
    borderTopColor: 'gray',
    borderTopWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 10,
  },
  specsContainer: {
    marginTop: 10,
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
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 50,
    flexDirection: 'row',
    paddingHorizontal: 40,
    borderRadius: 5,
    paddingVertical: 10,
  },
});