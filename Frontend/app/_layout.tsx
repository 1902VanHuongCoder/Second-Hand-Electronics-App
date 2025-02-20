import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import "../global.css";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import { store } from '../store/store';
// Prevent splash screen from auto-hiding before loading assets
SplashScreen.preventAutoHideAsync();

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
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }}  />
            <Stack.Screen name="profileSettings" options={{ headerShown: true, title: 'Cài đặt tài khoản', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }}  />
            <Stack.Screen name="login" options={{ headerShown: false }}  />
            <Stack.Screen name="signup" options={{ headerShown: false }}  />
            <Stack.Screen name="publishPost" options={{ title: 'Đẩy tin', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center' }}  />
            <Stack.Screen name="postDetails" options={{ title: 'Chi tiết bài đăng', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center'}} />
            <Stack.Screen name="payment" options={{ title: 'Thanh toán', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center'}} />
            <Stack.Screen name="searchResults" options={{ title: 'Kết quả tìm kiếm', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center'}} />
            <Stack.Screen name="chat" options={{ title: 'Trò chuyện', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center'}} />
            <Stack.Screen name="hiddenPosts" options={{ title: 'Ẩn bài đăng', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center'}} />

            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="_sitemap" options={{ title: 'Sitemap' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
          </Stack>
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
