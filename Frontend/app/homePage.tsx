import {
  Text,
  View,
  TouchableHighlight,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { Component } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Link } from "expo-router";
import AppBarForHome from "@/components/AppBarForHome";
import { Ionicons } from '@expo/vector-icons';
export default function HomePage() {
  const [text, onChangeText] = React.useState("");
  const products = [
    {
      id: "1",
      name: "Laptop Acer Aspire 3 Spin A3SP14-31PT-387Z",
      configuration: "I3-N305/8GB/512GB/14.0 FHD+/CẢM ỨNG/WIN11/XÁM",
      price: "9.000.000 đ",
      address: "Ba Đình - Hà Nội",
      postingDate: "23:34:23 12/02/2024",
      image:
        "../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg",
      avatar:
        "../assets/images/z6186705977978_00edd678a64db50dba5ef61a50391611.jpg",
      nameUser: "Hoàng Anh Lê",
    },
    {
      id: "2",
      name: "Laptop Acer Aspire 3 Spin A3SP14-31PT-387Z",
      configuration: "I3-N305/8GB/512GB/14.0 FHD+/CẢM ỨNG/WIN11/XÁM",
      price: "9.000.000 đ",
      address: "Ba Đình - Hà Nội",
      postingDate: "23:34:23 12/02/2024",
      image:
        "../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg",
      avatar:
        "../assets/images/z6186705977978_00edd678a64db50dba5ef61a50391611.jpg",
      nameUser: "Hoàng Anh",
    },
    {
      id: "3",
      name: "Laptop Acer Aspire 3 Spin A3SP14-31PT-387Z",
      configuration: "I3-N305/8GB/512GB/14.0 FHD+/CẢM ỨNG/WIN11/XÁM",
      price: "9.000.000 đ",
      address: "Ba Đình - Hà Nội",
      postingDate: "23:34:23 12/02/2024",
      image:
        "../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg",
      avatar:
        "../assets/images/z6186705977978_00edd678a64db50dba5ef61a50391611.jpg",
      nameUser: "Hoàng Anh",
    },
  ];
  return (
    // <SafeAreaView className="flex-1">
    <View className="px-4 mt-6">
      <View className="flex flex-row justify-start items-center gap-4">

           <TextInput
          className="border-2 border-[#D9D9D9] w-2/3 px-2 py-4 text-[#000] rounded-lg font-semibold"
          onChangeText={onChangeText}
          value={text}
          placeholder="Tìm kiếm ..."
        /><TouchableHighlight className="bg-[#9661D9] w-1/3 px-6 py-4 rounded-lg flex items-center justify-center">
          <Text className="text-[#fff] font-semibold text-[16px] text-center">
            Tìm kiếm
          </Text>
        </TouchableHighlight>
        </View>
       
        
    
      <LinearGradient
        colors={['#523471', '#9C62D7']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{ padding: 12, borderRadius: 10, marginTop: 20 }}
        className="flex-row items-center"
      >
        <View className="w-[50%]">
          <Text className="uppercase font-bold text-white text-[18px]">
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
      <ScrollView>
        {products.map((product) => (
          <View
            key={product.id}
            className="mt-6 flex-col gap-4 border-b border-[#D9D9D9] pb-4"
          >
            <View className="flex-col gap-4">
              <View className="flex-row gap-2 w-full">
                <Link href="/postDetails">
                  <Image
                    style={{ width: 170, height: 170 }}
                    source={require("../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg")}
                  /> </Link>
                <View className="w-[50%] flex-col gap-1">
                  <View className="flex-row gap-1">
                    <Text className="font-bold text-[16px]">{product.name}</Text>
                    <TouchableHighlight>
                      <Icon name="ellipsis-v" size={18} color="#9661D9" />
                    </TouchableHighlight>
                  </View>
                  <Text className="text-[12px]">{product.configuration}</Text>
                  <Text className="font-bold text-[#9661D9] text-[16px]">
                    {product.price}
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
                    style={{ width: 50, height: 50 }}
                    className="rounded-full"
                    source={require("../assets/images/z6186705977978_00edd678a64db50dba5ef61a50391611.jpg")}
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
          </View>
        ))}
      </ScrollView>
    </View>

    // </SafeAreaView>
  );
}

//npm install react-native-linear-gradient sử dụng này để gradient background
//npm install react-native-vector-icons cài icon
