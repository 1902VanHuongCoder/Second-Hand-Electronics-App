import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native';
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