import React from 'react';
import { View } from 'react-native';
import HomePage from '../homePage';
import ListChats from '../listChats';
import EditProfile from '../editProfile';
import Payment from '../payment';
import HidePosting from '../hidePosting';
import { SafeAreaView } from 'react-native-safe-area-context';
import PushNews from '../pushNews';
const index = () => {
    return (
        <SafeAreaView>
            <View className='bg-white w-full h-full'>
                <HidePosting />
            </View>
        </SafeAreaView>
    );
};

export default index;