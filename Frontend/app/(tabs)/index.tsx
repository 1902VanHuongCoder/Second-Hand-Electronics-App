import React from 'react';
import { SafeAreaView } from 'react-native';
import AuthScreen from '../AuthScreen';
import Home from '../Home';
import { useAuth } from '../../context/AuthContext';

export default function Index() {
    const { userToken } = useAuth();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {userToken ? (
                <Home />
            ) : (
                <AuthScreen />
            )}
        </SafeAreaView>
    );
}