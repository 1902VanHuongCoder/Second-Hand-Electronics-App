
import React, {useContext, useState} from 'react';

import { View } from 'react-native';
import HomePage from '../homePage';
// import PostDetailsScreen from '../postDetails';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppBarForHome from '@/components/AppBarForHome';
import Notification from '@/components/Notification';
import { NotificationContext } from '@/context/NotificationContext';


export default function Index() {
    // const { userToken } = useAuth();
    const { notifications, showNotification} = useContext(NotificationContext);

    return (

        <SafeAreaView>
            <View className='bg-white w-screen h-full'>
                <AppBarForHome />
                <HomePage />
                <Notification message={notifications.message} type={notifications.type} visible={notifications.visible} /> 
            </View>

        </SafeAreaView>
    );
}