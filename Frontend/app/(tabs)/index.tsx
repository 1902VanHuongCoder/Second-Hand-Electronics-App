import React, {useState} from 'react';
import { View } from 'react-native';
import HomePage from '../homePage';
// import PostDetailsScreen from '../postDetails';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBarForHome from '@/components/AppBarForHome';


export default function Index() {
    // const { userToken } = useAuth();


    return (

        <SafeAreaView>
            <View className='bg-white w-full h-full'>
                <AppBarForHome />
                <HomePage />
                {/* <LoginScreen /> */}
            </View>

        </SafeAreaView>
    );
}