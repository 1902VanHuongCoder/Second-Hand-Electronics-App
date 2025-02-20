import React from 'react';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import Page from './app/Page';
import store from './store'; // Đảm bảo bạn đã tạo store

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Page />
      </AuthProvider>
    </Provider>
  );
}