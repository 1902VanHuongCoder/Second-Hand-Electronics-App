import React from 'react';
import { View } from 'react-native';
import HomePage from '../homePage';
import ListChats from '../listChats';
import EditProfile from '../editProfile';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
    return (
        <SafeAreaView>
            <View className='bg-white w-full h-full'>
                <HomePage />
            </View>
        </SafeAreaView>
    );
};

export default index;