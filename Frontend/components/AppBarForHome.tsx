import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function AppBarForHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>2HAND MARKET</Text>
      <View style={styles.appbarvectorcontainer}>
        <Text style={styles.ontopofappbarvector}></Text>
        <Image style={styles.appbarvector} source={require('../assets/images/AppbarVector.png')} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#9C62D7',
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 20,
    marginBottom: 0,
    width: '100%',
  },
  logoText: {
    color: 'white',
    fontSize: 40,
    marginLeft: 10,
    fontFamily: 'Knewave',
    paddingHorizontal: 10,
    width: 300,
  },
  appbarvectorcontainer: {
    position: 'absolute',
    width: '120%',
    top: 0,
    height: 80,
  },
  appbarvector: {
    width: '100%',
    height: 80,
    position: 'absolute',
    top: -25,
    left: 0,
    zIndex: -10,
    opacity: 0.5,
  },
  ontopofappbarvector : {
    position: 'absolute',
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.2)',
    top: 0,
    left: 0,
    zIndex: -5,
  }
});