import React from 'react';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import store from './store'; // Đảm bảo bạn đã tạo store
import { LogBox } from 'react-native';
import HomePage from './app/homePage';

// Tắt cảnh báo lỗi Text strings must be rendered within a <Text> component
LogBox.ignoreLogs([
  'Warning: Text strings must be rendered within a <Text> component',
  '(NOBRIDGE) ERROR Warning: Text strings must be rendered within a <Text> component',
]);

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </Provider>
  );
}