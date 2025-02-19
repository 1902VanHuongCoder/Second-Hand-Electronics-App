import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileScreen from '../ProfileScreen';

const PersonalPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trang Cá Nhân</Text>
      <ProfileScreen />
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
});

export default PersonalPage; 