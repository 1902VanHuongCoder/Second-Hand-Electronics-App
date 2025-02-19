import React from 'react';
import { View } from 'react-native';
import HomePage from '../homePage';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostDetailsScreen from '../postDetails';
import AppBarForHome from '@/components/AppBarForHome';

const index = () => {
    return (
        <SafeAreaView>
            <View className='bg-white w-full min-h-screen'>
                <AppBarForHome />
                <HomePage />
            </View>
        </SafeAreaView>
    );
};

export default index;