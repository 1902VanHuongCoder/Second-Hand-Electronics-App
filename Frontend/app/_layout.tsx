import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";
import { useColorScheme } from '@/hooks/useColorScheme';
// import { Provider, useSelector } from 'react-redux';
// import { store } from '../store/store';
// import { RootState } from '../store/store';

// Prevent splash screen from auto-hiding before loading assets
SplashScreen.preventAutoHideAsync();

// ✅ Move `RootLayoutInner` inside `Provider`
export default function RootLayoutInner() {
  // const router = useRouter();
  // const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const colorScheme = useColorScheme();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.replace("/login");
  //   }
  // }, [isAuthenticated]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// // ✅ Wrap the whole app with `<Provider>`
// export default function RootLayout() {
//   return (
//     <Provider store={store}>
//       <RootLayoutInner />
//     </Provider>
//   );
// }
