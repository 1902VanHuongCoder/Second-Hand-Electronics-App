import { Text, View, TouchableHighlight, TextInput, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthCheck } from '../../store/checkLogin';
import socket from '@/utils/socket';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import rootURL from '@/utils/backendRootURL';
// Import a default user icon
const defaultUserIcon = require('@/assets/images/defaultUserIcon.png'); // Adjust the path as needed

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
    senderMessagesNotRead: [],
    receiverMessagesNotRead: [],
}

export default function MessageList() {
    const [text, onChangeText] = React.useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const checkAuth = useAuthCheck();
    const [rooms, setRooms] = useState<MessageProps[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<MessageProps[]>([]);
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleNavigateToChat = (roomCode: string) => {
        if (user) {
            socket.emit("read", roomCode, user.id);
            router.push(`/chat?roomCode=${roomCode}`);
        } else {
            router.push("/login");
        }
    }

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        function fetchGroups() {
            fetch(`${rootURL}/api/chat`)
                .then((res) => res.json())
                .then((data) => {
                    if (user) {
                        const filteredRooms = data.filter((room: MessageProps) => room.senderId === user.id || room.receiverId === user.id);
                        setRooms(filteredRooms);
                        setFilteredRooms(filteredRooms);
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
                setFilteredRooms((prevRooms) => [...prevRooms, newRoom]);
            }
        });
        
        socket.on("newMessageCreated", (updateMessageList: MessageProps[]) => {
            if (user) {
                const filteredRooms = updateMessageList.filter((room: MessageProps) => room.senderId === user.id || room.receiverId === user.id);
                setRooms(filteredRooms);
                setFilteredRooms(filteredRooms);
            };
        })

        socket.on("deleteNotification",(updateMessageList: MessageProps[]) => {
            if (user) {
                const filteredRooms = updateMessageList.filter((room: MessageProps) => room.senderId === user.id || room.receiverId === user.id);
                setRooms(filteredRooms);
                setFilteredRooms(filteredRooms);
            }
        })
        return () => {
            socket.off("createdRoom");
            socket.off("newMessageCreated");
        };
    }, [socket, user]);

    // Filter rooms based on search query
    useEffect(() => {
        if (searchQuery === "") {
            setFilteredRooms(rooms);
        } else {
            const filtered = rooms.filter((room) =>
                room.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.productTitle.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRooms(filtered);
        }
    }, [searchQuery, rooms]);

    return (
        <View className='bg-white w-full h-full p-4'>
            <View className="w-full flex-row justify-between items-center border-b-[1px] pb-4 border-[#D9D9D9] mb-4">
                <TextInput
                    className="border-2 border-[#D9D9D9] w-[69%] px-2 py-4 text-[#000] rounded-lg font-semibold focus:border-[2px] focus:border-[#9661D9] focus:outline-none"
                    onChangeText={(text) => setSearchQuery(text)}
                    value={searchQuery}
                    placeholder="Tìm kiếm ..."
                />
                <TouchableHighlight className="bg-[#9661D9] w-[29%] ml-[2%] px-5 py-4 rounded-lg flex items-center justify-center">
                    <Text className="text-[#fff] font-semibold text-[16px] text-center">
                        Tìm kiếm
                    </Text>
                </TouchableHighlight>
            </View>
            <ScrollView>
                {filteredRooms.map((room) => (
                    <TouchableHighlight
                        key={room.roomCode}
                        onPress={() => handleNavigateToChat(room.roomCode)}
                        underlayColor="#DDDDDD"
                    >
                        <View className='flex-row justify-between border-b-[1px] border-[#D9D9D9] pb-4 mb-4'>
                            <View className='flex-row gap-2 relative'>
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
                                <Text className={`absolute bottom-0 left-14 w-[20px] h-[20px] text-center bg-red-500 text-white rounded-full ${user && user.id === room.senderId && room.senderMessagesNotRead.length > 0 ? 'block' : 'hidden' }`}>{user && user.id === room.senderId && room.senderMessagesNotRead.length > 0 && room.senderMessagesNotRead.length}</Text>
                                <Text className={`absolute bottom-0 left-14 w-[20px] h-[20px] text-center bg-red-500 text-white rounded-full ${user && user.id === room.receiverId && room.receiverMessagesNotRead.length > 0 ? 'block' : 'hidden' }`}>{user && user.id === room.receiverId && room.receiverMessagesNotRead.length > 0 && room.receiverMessagesNotRead.length}</Text>
                            </View>
                            <Image style={{ width: 70, height: 70 }} className='rounded-md' source={{ uri: room.productImage }} />
                        </View>
                    </TouchableHighlight>
                ))}
            </ScrollView>
        </View>
    );
}