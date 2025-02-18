import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePathname } from 'expo-router';
import Icon from "react-native-vector-icons/FontAwesome";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#9661D9',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Icon size={25} name="home" color={color} />,
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
          title: 'Đăng tin',
          tabBarIcon: ({ color }) => <Icon size={25} name="pencil-square" color={color} />,
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
