import { Text, View, TouchableHighlight, TextInput, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthCheck } from '../../store/checkLogin';
import socket from '@/utils/socket';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

// Import a default user icon
const defaultUserIcon = require('../../assets/images/defaultUserIcon.png'); // Adjust the path as needed

interface MessageItemProps {
    senderId: string;
    text: string;
    time: Date;
}

interface MessageProps {
    roomCode: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    receiverName: string;
    senderAvatar: string | null;
    receiverAvatar: string | null;
    productImage: string;
    productTitle: string;
    productPrice: string;
    messages: MessageItemProps[];
}

export default function MessageList() {
    const [text, onChangeText] = React.useState("");
    const checkAuth = useAuthCheck();
    const [rooms, setRooms] = useState<MessageProps[]>([]);
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        function fetchGroups() {
            fetch("http://10.0.2.2:5000/api/chat")
                .then((res) => res.json())
                .then((data) => {
                    if (user) {
                        const filteredRooms = data.filter((room: MessageProps) => room.senderId === user.id || room.receiverId === user.id);
                        setRooms(filteredRooms);
                    }
                })
                .catch((err) => console.error(err));
        }
        if (user) {
            fetchGroups();
        }
    }, [user]);

    useEffect(() => {
        socket.on("createdRoom", (newRoom: MessageProps) => {
            if (user && (newRoom.senderId === user.id || newRoom.receiverId === user.id)) {
                setRooms((prevRooms) => [...prevRooms, newRoom]);
            }
        });
        socket.on("newMessageCreated", (updateMessageList: MessageProps[]) => {
            if (user) {
                const filteredRooms = updateMessageList.filter((room: MessageProps) => room.senderId === user.id || room.receiverId === user.id);
                setRooms(filteredRooms);
            }
        })
        return () => {
            socket.off("createdRoom");
        };
    }, [socket, user]);

    return (
        <View className='bg-white w-full h-full p-4'>
            <View className="flex-row justify-between items-center border-b-2 pb-4 border-[#D9D9D9] mb-4">
                <TextInput
                    className="border-2 border-[#D9D9D9] w-2/3 px-2 py-4 text-[#000] rounded-lg font-semibold"
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Tìm kiếm ..."
                />
                <TouchableHighlight className="bg-[#9661D9] px-5 py-4 rounded-lg flex items-center justify-center">
                    <Text className="text-[#fff] font-semibold text-[16px] text-center">
                        Tìm kiếm
                    </Text>
                </TouchableHighlight>
            </View>
            <ScrollView>
                {rooms.map((room) => (
                    <TouchableHighlight
                        key={room.roomCode}
                        onPress={() => router.push(`/chat?roomCode=${room.roomCode}`)}
                        underlayColor="#DDDDDD"
                    >
                        <View className='flex-row justify-between border-b-2 border-[#D9D9D9] pb-4 mb-4'>
                            <View className='flex-row gap-2'>
                                <Image
                                    style={{ width: 70, height: 70 }}
                                    className='rounded-full'
                                    source={room.senderId === user?.id ? 
                                        (room.receiverAvatar ? { uri: room.receiverAvatar } : defaultUserIcon) : 
                                        (room.senderAvatar ? { uri: room.senderAvatar } : defaultUserIcon)}
                                />
                                <View className='flex-col gap-1'>
                                    <Text className='font-bold text-[18px]'>{room.senderId === user?.id ? room.receiverName : room.senderName}</Text>
                                    <Text className='text-[14px] text-[#808080] font-bold'>{room.productTitle}</Text>
                                    <Text className='text-[12px] text-[#808080] font-medium'>{room.messages.length > 0 ? room.messages[room.messages.length - 1].text : "No messages yet"}</Text>
                                </View>
                            </View>
                            <Image style={{ width: 70, height: 70 }} className='rounded-md' source={{ uri: room.productImage }} />
                        </View>
                    </TouchableHighlight>
                ))}
            </ScrollView>
        </View>
    );
}