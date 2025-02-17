import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, StyleSheet, Pressable, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/store';
import { red } from 'react-native-reanimated/lib/typescript/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpScreen() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [validateInput, setValidateInput] = useState({ phoneError: '', passwordError: '' });

    const dispatch = useDispatch<AppDispatch>();
    const { loading,error, user } = useSelector((state: RootState) => state.auth);

    const handleSignup = () => {
        if (password === '') {
            setValidateInput({ ...validateInput, passwordError: 'Vui lòng nhập mật khẩu' });
        }
        if (phone === '') {
            setValidateInput({ ...validateInput, phoneError: 'Vui lòng nhập số điện thoại' });
        }
      
        alert("Đăng nhập thành công");
        dispatch(loginUser({ phone, password }));
    };

    return (
        <View className='relative bg-red-500 flex h-screen justify-center items-center bg-white px-10'>
            <Text className='text-xl font-bold w-full '>ĐĂNG KÝ</Text>
            <Text className='mt-8 w-full text-left text-md'>Số điện thoại</Text>
            <TextInput
                className="outline-none border-2 border-gray-400 rounded-md px-2 py-3 w-full bg-white mt-2 placeholder-opacity-50 placeholder-gray-400"
                placeholder="0xx-xxx-xxxx"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"

            />
            {validateInput.phoneError !== '' && <Text className='w-full py-3 text-red-500'>{validateInput.phoneError}</Text>}

            <Text className='mt-5 w-full text-left text-md'>Mật khẩu</Text>
            <TextInput
                className="outline-none border-2 border-gray-400 rounded-md px-2 py-3 w-full bg-white mt-2 placeholder-opacity-50 placeholder-gray-400"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry

            />
            {validateInput.passwordError !== '' && <Text className='w-full py-3 text-red-500'>{validateInput.passwordError}</Text>}


            {error && <Text className='w-full py-3 text-red-500'>{error} </Text>}
            {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (<Pressable onPress={handleSignup}><LinearGradient
                colors={['rgba(156,98,215,1)', 'rgba(82,52,113,1)']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.button}
                className='mt-5 shadow-sm'
            >
                <Text className='text-white font-bold'>ĐĂNG KÝ</Text>
            </LinearGradient></Pressable>)}
        
            <Image className='absolute top-0 w-screen -z-10' source={require('@/assets/images/Vector 1.png')} style={{ alignSelf: 'center' }} />
            <Image className='absolute bottom-10 w-screen -z-10' source={require('@/assets/images/Vector 2.png')} style={{ alignSelf: 'center' }} />
            <Text className='mt-5'>Hoặc</Text>
            <Pressable className="mt-5" onPress={handleSignup}>
                <Text className="text-black text-center underline">Đăng nhập</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        backgroundColor: 'red',
    },
    button: {
        paddingHorizontal: 50,
        borderRadius: 5,
        paddingVertical: 10,
    }
})

