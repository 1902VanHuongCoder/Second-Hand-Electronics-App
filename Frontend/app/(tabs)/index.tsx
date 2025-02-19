import React from 'react';
import { View } from 'react-native';
import HomePage from '../homePage';
import ListChats from './listChats';
import EditProfile from '../editProfile';
import Payment from '../payment';
import Message from '../message';
import HidePosting from '../hidePosting';
// import PostDetailsScreen from '../postDetails';
import { SafeAreaView } from 'react-native-safe-area-context';
import PushNews from '../pushNews';
import SearchResults from '../searchResults';
import PostDetailsScreen from '../postDetails';
import AppBarForHome from '@/components/AppBarForHome';

const index = () => {
    return (
        <SafeAreaView>
            <View className='bg-white w-full h-full'>
                <AppBarForHome />
                <HomePage />
            </View>
        </SafeAreaView>
    );
};

export default index;