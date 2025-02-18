import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { updateUser as updateUserAction } from '../store/authSlice';

const ProfileScreen = () => {
  const { userData, userToken } = useAuth();
  const dispatch = useDispatch();

  if (!userData) {
    return <Text>Đang tải thông tin người dùng...</Text>;
  }

  const [name, setName] = useState(userData.name || '');
  const [email, setEmail] = useState(userData.email || '');
  const [phone, setPhone] = useState(userData.phone || '');
  const [address, setAddress] = useState(userData.address || '');
 console.log(userData)
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      setAddress(userData.address || '');
    }
  }, [userData]);

  const handleSave = async () => {
    if (!phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:5000/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          id: userData.id,
          name,
          email,
          phone,
          address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thông báo', data.message);
        
        // Cập nhật thông tin trong Redux ngay lập tức
        dispatch(updateUserAction({ 
          user: { 
            id: userData.id, 
            name, 
            email, 
            phone, 
            address 
          } 
        }));
      } else {
        Alert.alert('Lỗi', data.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={address}
        onChangeText={setAddress}
      />
      <View style={styles.buttonContainer}>
        <Button title="Lưu" onPress={handleSave} />
        <Button title="Hủy" onPress={() => Alert.alert('Thông báo', 'Thay đổi đã bị hủy')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProfileScreen;