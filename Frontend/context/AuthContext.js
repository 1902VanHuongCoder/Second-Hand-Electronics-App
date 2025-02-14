import React, { createContext, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction, logout as logoutAction, register as registerAction } from '../store/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { userToken, userData, isLoading } = useSelector(state => state.auth);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userData');
      
      if (token && user) {
        dispatch(loginAction({ token, user: JSON.parse(user) }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (data) => {
    await AsyncStorage.setItem('userToken', data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    dispatch(loginAction(data));
  };

  const register = async (data) => {
    await AsyncStorage.setItem('userToken', data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    dispatch(registerAction(data));
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      dispatch(logoutAction());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoading,
      userToken,
      userData,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 