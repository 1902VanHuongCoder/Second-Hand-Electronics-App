import { Text, View, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, type, visible}) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    useEffect(() => {
        if (visible) {
            // Khi thông báo hiển thị, trượt vào
            Animated.timing(translateY, {
                toValue: 0, // Vị trí cuối cùng
                duration: 300, // Thời gian trượt
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            // Khi thông báo ẩn, trượt ra ngoài
            Animated.timing(translateY, {
                toValue: -100, // Vị trí ra ngoài
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);
    const backgroundColor = type === 'success' ? '#31BD9A' : '#F52E56';
    const iconName = type === 'success' ? 'checkmark-circle-outline' : 'close-circle-outline';

    return (
        <Animated.View style={[styles.notificationContainer, { backgroundColor, transform: [{ translateY }] }]}>
            <View style={styles.circleSmall}></View>
            <View style={styles.circleBig}>
                <Ionicons name={iconName} size={40} color="#808080" />
            </View>
            <View>
                <Text style={styles.textType} className='font-extrabold text-white'>{type.toUpperCase()}!</Text>
                <Text className='text-white font-medium text-[16px]'>{message}</Text>
            </View>
            {/* <TouchableOpacity style={styles.iconAbsolute}>
                <Ionicons name="close-outline" size={32} color="#FFF" />
            </TouchableOpacity> */}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    notificationContainer: {
        position: 'absolute',
        top: '15%',
        left: '4%',
        margin: "auto",
        width: '100%',
        backgroundColor: '#F52E56',
        borderRadius: 15,
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        gap: 14,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        zIndex: 25,
    },
    circleSmall: {
        width: 10,
        height: 10,
        borderRadius: 100,
        backgroundColor: '#FFF',
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    circleBig: {
        backgroundColor: '#FFF',
        width: 50,
        height: 50,
        borderRadius: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconAbsolute: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    textType: {
        fontSize: 20,
    },
});

export default Notification;