import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native';
import LoginScreen from '../login';
import WelcomePage from '../welcomePage';
import HomePage from '../homePage';


const index = () => {
    return (
        <SafeAreaView>
            <View className='h-[500px] flex justify-center items-center'>
                <Text className='text-red-600 font-bold text-4xl'>Hello worlds</Text>
                <LoginScreen />
            </View>
        </SafeAreaView>
    );
};

export default index;