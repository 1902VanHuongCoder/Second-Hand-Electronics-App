import React from 'react';
import { View } from 'react-native';
import HomePage from '../homePage';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
    return (
        <SafeAreaView>
            <View className='bg-white w-full min-h-screen'>
                <HomePage />
            </View>
        </SafeAreaView>
    );
};

export default index;