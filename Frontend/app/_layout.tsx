import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Prevent splash screen from auto-hiding before loading assets
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Roboto: require('../assets/fonts/Roboto.ttf'),
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
            <Stack.Screen name="login" options={{ title: 'Đăng nhập', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff' }}  />
            <Stack.Screen name="signup" options={{ title: 'Đăng ký', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff' }}  />
            <Stack.Screen name="postDetails" options={{ title: 'Chi tiết bài đăng', headerStyle: { backgroundColor: '#9C62D7' }, headerTintColor: '#fff', headerTitleAlign: 'center'}} />
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
