import React, { useState } from 'react';
import { View } from 'react-native';
import Login from './login';
import Register from './register';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../store/authSlice';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();

  const handleLoginSuccess = async (data: any) => {
    dispatch(loginAction(data));
  };

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  return (
    <View style={{ flex: 1 }}>
      {isLogin ? (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={toggleAuth}
          options={{ tabBarStyle: { display: 'none' } }}
        />
      ) : (
        <Register 
          onSwitchToLogin={toggleAuth}
          options={{ tabBarStyle: { display: 'none' } }}
        />
      )}
    </View>
  );
};

export default AuthScreen; 