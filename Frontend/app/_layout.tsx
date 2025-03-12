import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { AuthProvider } from '../context/AuthContext';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet } from 'react-native';

import 'react-native-reanimated';
import "../global.css";
import { useColorScheme } from '@/hooks/useColorScheme';
import { store } from '../store/store';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { NotificationProvider } from '../context/NotificationContext';
import { checkAuth } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tắt cảnh báo lỗi Text strings must be rendered within a <Text> component
LogBox.ignoreLogs([
  'Warning: Text strings must be rendered within a <Text> component',
  '(NOBRIDGE) ERROR Warning: Text strings must be rendered within a <Text> component',
]);

// Prevent splash screen from auto-hiding before loading assets
SplashScreen.preventAutoHideAsync();

// Component to handle auth check
function AuthCheck() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Dispatch checkAuth when app starts
    // @ts-ignore - Bỏ qua lỗi kiểu dữ liệu
    dispatch(checkAuth());
  }, [dispatch]);
  
  return null;
}

export default function RootLayout() {

  const router = useRouter();

  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Roboto: require('../assets/fonts/Roboto.ttf'),
    RobotoItalic: require('../assets/fonts/Roboto-VariableFont_wdth,wght.ttf'),
    Monomakh: require('../assets/fonts/Monomakh-Regular.ttf'),
    Knewave: require('../assets/fonts/Knewave-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <NotificationProvider>
          <AuthCheck />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="profileSettings" options={{ headerShown: true, title: 'Cài đặt tài khoản', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="publishPost" options={{ title: 'Đẩy tin', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />
            <Stack.Screen name="postDetails" options={{ title: 'Chi tiết bài đăng', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />
            <Stack.Screen name="payment" options={{ title: 'Thanh toán', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />
            <Stack.Screen name="searchResults" options={{ title: 'Kết quả tìm kiếm', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />
            <Stack.Screen name="chat" options={{ title: 'Trò chuyện', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />
            <Stack.Screen name="hiddenPosts" options={{ title: 'Ẩn bài đăng', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />
            <Stack.Screen name="test-chat-penal" options={{ title: 'Trinh Huy Chat', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />
            <Stack.Screen name="admin" options={{ title: 'Quản trị viên', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />
            <Stack.Screen name="admin/reports" options={{ title: 'Quản lý báo cáo', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />

            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="_sitemap" options={{ title: 'Sitemap' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
          </Stack>
        </NotificationProvider>
      </Provider>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#9C62D7',
    height: 80,
  },
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: '#9C62D7',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
