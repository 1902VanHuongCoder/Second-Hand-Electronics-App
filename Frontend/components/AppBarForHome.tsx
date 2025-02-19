import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

export default function AppBarForHome() {
  return (
      <View style={styles.container}>
        <Text style={styles.logoText}>2HAND STORE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9C62D7',
    flexDirection: 'row',
    alignItems: 'center',
    height: 80, 
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});