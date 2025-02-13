import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native';
import LoginScreen from '../login';
import WelcomePage from '../welcomePage';
import HomePage from '../homePage';


const index = () => {
    return (
        <SafeAreaView>
            <View>
                <WelcomePage />
            </View>
        </SafeAreaView>
    );
};

export default index;