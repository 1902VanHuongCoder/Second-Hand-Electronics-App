import React from 'react';

import { View } from 'react-native';
import HomePage from '../homePage';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';

export default function Index() {
    const { userToken } = useAuth();


    return (

        <SafeAreaView>
            <View className='bg-white w-full min-h-screen'>
                <HomePage />
            </View>

        </SafeAreaView>
    );
}