import React, { useState } from 'react';
import { View, TextInput, Text, ActivityIndicator, StyleSheet, Pressable, Image, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [validateInput, setValidateInput] = useState({ phoneError: '', passwordError: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);

  const handleSignup = async () => {
    let valid = true;
    if (phone === '') {
      setValidateInput((prev) => ({ ...prev, phoneError: 'Vui lòng nhập số điện thoại' }));
      valid = false;
    } else {
      setValidateInput((prev) => ({ ...prev, phoneError: '' }));
    }
    if (password === '') {
      setValidateInput((prev) => ({ ...prev, passwordError: 'Vui lòng nhập mật khẩu' }));
      valid = false;
    } else {
      setValidateInput((prev) => ({ ...prev, passwordError: '' }));
    }

    if (valid) {
      setIsLoading(true);
      const resultAction = await dispatch(signupUser({ phone, password }));

      if (resultAction.type === 'auth/signupUser/fulfilled') {
        alert("Đăng ký thành công");
        setPhone('');
        setPassword('');
      } else {
        alert(resultAction.payload);
      }
      setIsLoading(false);
    }
  };

  return (
    <View className='relative bg-white h-screen items-center px-10'>
      <View className='relative z-20 flex justify-center items-center w-full p-5 h-screen'>
        <Text className='text-4xl font-bold w-full '>ĐĂNG KÝ</Text>
        <Text className='mt-8 w-full text-left text-lg'>Số điện thoại</Text>
        <TextInput
          className="outline-none font-semibold border-2 text-lg border-gray-400 rounded-md px-2 py-3 w-full bg-white mt-2 placeholder-opacity-50 placeholder-gray-400"
          placeholder="0xx-xxx-xxxx"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!loading}
        />
        {validateInput.phoneError !== '' && <Text className='w-full py-3 text-red-500'>{validateInput.phoneError}</Text>}

        <Text className='mt-5 w-full text-left text-lg'>Mật khẩu</Text>
        <View style={styles.passwordContainer} className='mb-5'>
          <TextInput
            className="outline-none font-semibold border-2 text-lg border-gray-400 rounded-md px-2 py-3 w-full bg-white mt-2 placeholder-opacity-50 placeholder-gray-400"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={styles.passwordInput}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        {validateInput.passwordError !== '' && <Text className='w-full py-3 text-red-500'>{validateInput.passwordError}</Text>}

        {error && <Text className='w-full py-3 text-red-500'>{error} </Text>}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Pressable onPress={handleSignup}>
            <LinearGradient
              colors={['rgba(156,98,215,1)', 'rgba(82,52,113,1)']}
              start={[0, 0]}
              end={[1, 0]}
              style={styles.button}
              className='mt-5 shadow-sm'
            >
              <Text className='text-white font-bold'>ĐĂNG KÝ</Text>
            </LinearGradient>
          </Pressable>
        )}

        <Text className='my-5 text-lg'>Hoặc</Text>
        <Link href="/login">
          <Text className='underline  text-lg text-[#9661D9] font-semibold'>Đăng nhập</Text>
        </Link>
      </View>

      <Image className='absolute top-0  w-[130%] z-5' source={require('@/assets/images/Vector 1.png')} style={{ alignSelf: 'center' }} />
      <Image className='absolute bottom-0 w-[130%] z-5' source={require('@/assets/images/Vector 2.png')} style={{ alignSelf: 'center' }} />

    </View>
  );
}

const styles = StyleSheet.create({
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    width: '100%',
  },
  eyeIcon: {
    marginLeft: 10,
    position: 'absolute',
    right: 12,
    top: 20,
  },
  button: {
    paddingHorizontal: 50,
    borderRadius: 8,
    paddingVertical: 14,
  },
});