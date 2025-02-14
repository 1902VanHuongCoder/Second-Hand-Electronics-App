import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native';
import LoginScreen from '../login';
import WelcomePage from '../welcomePage';
import HomePage from '../homePage';
import Profile from './profile';

const index = () => {
    return (
        <SafeAreaView>

<!--                 <LoginScreen /> -->

            <View className='bg-white w-full min-h-screen'>
                <HomePage />
            </View>
        </SafeAreaView>
    );
};

export default index;