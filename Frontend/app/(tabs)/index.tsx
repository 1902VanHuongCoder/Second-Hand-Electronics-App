import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native';

const index = () => {
    return (
        <SafeAreaView>
            <View>
                <Text className='text-red-600 font-bold text-4xl'>Hello worlds</Text>
            </View>
        </SafeAreaView>
    );
};

export default index;