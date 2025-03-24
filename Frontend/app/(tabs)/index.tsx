
import React, {useContext, useState} from 'react';
import { View } from 'react-native';
import HomePage from '../homePage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
    return (

        <SafeAreaView>
            <View className='bg-white w-screen h-full'>
                <HomePage />
            </View>

        </SafeAreaView>
    );
}