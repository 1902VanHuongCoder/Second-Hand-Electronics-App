import { Tabs, useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePathname } from 'expo-router';
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from '@expo/vector-icons';
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#9661D9',
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        headerStyle: styles.header, 
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerShadowVisible: false, 
        headerLeft: () => (
          <TouchableOpacity  onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        ),
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background
            borderTopWidth: 0, // Remove top border
            height: 70, // Increase height
            paddingBottom: 10, // Add padding to the bottom
            paddingTop: 10, // Add padding to the top
            paddingHorizontal: 10, // Add padding to the sides
          },
          android: {
            backgroundColor: '#fff',
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            paddingHorizontal: 10,
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontSize: 12, // Customize font size
          fontWeight: '600', // Customize font weight
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="post_management"
        options={{
          title: 'Quản lý tin',
          tabBarIcon: ({ color }) => <Icon size={25} name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="post_news"

        options={{
          title:"Đăng tin", // Set the title directly
          tabBarIconStyle: { marginBottom: 10, height: 70, backgroundColor: '#ffffff', width: 70, borderRadius: 40, color: '#9661D9', borderColor: '#9661D9', borderWidth: 4, transform: [{ translateY: -30 }] },
          tabBarIcon: ({ color }) => <Ionicons size={40} name="add-outline" color={color} />,
          tabBarStyle: { 
            // backgroundColor: 'blue', // Đổi màu nền của tab này
            paddingHorizontal: 10, // Thêm padding cho tab này
            height: 70, // Thay đổi chiều cao của tab này
            paddingTop: 10, // Thêm padding cho tab này
          },
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: 'Tin Nhắn',
          tabBarIcon: ({ color }) => <Icon size={25} name="comments" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color }) => <Icon size={25} name="user-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#9661D9',
    height: 80,
    color: 'white',
  }
});