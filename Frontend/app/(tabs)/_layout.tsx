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
        headerShadowVisible: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        ),
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            paddingHorizontal: 10,
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
          fontSize: 12,
          fontWeight: '600',
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
        name="postManagement"
        options={{
          title: 'Quản lý tin',
          tabBarIcon: ({ color }) => <Icon size={25} name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="postCreation"

        options={{
          title: "Đăng tin", // Set the title directly
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
        name="messageList"
        options={{
          title: 'Tin nhắn',
          tabBarIcon: ({ color }) => <Icon size={25} name="comments" color={color} />,
        }}
      />
      <Tabs.Screen
        name="userProfile"
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