import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
// import { login as loginAction } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Định nghĩa API_URL
const API_URL = 'http://10.0.2.2:5000'; // Cập nhật URL theo cấu hình của bạn

interface LoginProps {
    onLoginSuccess: (data: any) => Promise<void>;
    onSwitchToRegister: () => void;
    options?: { tabBarStyle?: { display: string } };
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister, options }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!phone || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.data && data.data.token) {
                    await AsyncStorage.setItem('userToken', data.data.token);
                    await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
                    // dispatch(loginAction(data.data));
                    onLoginSuccess && onLoginSuccess(data.data);
                } else {
                    Alert.alert('Lỗi', 'Không nhận được token từ server');
                }
            } else {
                Alert.alert('Lỗi', data.message);
            }
        } catch (error: any) {
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container} >
            <Text style={styles.title}>ĐĂNG NHẬP</Text>
            <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!loading}
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
            />
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                </Text>
            </TouchableOpacity>
            <Text style={styles.link}>hoặc</Text>
            <TouchableOpacity onPress={onSwitchToRegister}>
                <Text style={styles.link}>Đăng ký</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default Login;

