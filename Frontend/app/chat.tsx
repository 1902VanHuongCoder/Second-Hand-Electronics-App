import { Text, View, Image, TextInput, ScrollView, TouchableHighlight, Modal, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import socket from "@/utils/socket";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ImageViewer from 'react-native-image-zoom-viewer';

interface Media {
    uri: string;
}

interface MessageItemProps {
    senderId: string;
    senderN: string;
    text: string;
    time: Date;
}

interface MessageProps {
    roomCode: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    receiverName: string;
    senderAvatar: string;
    receiverAvatar: string;
    productImage: string;
    productTitle: string;
    productPrice: string;
    messages: MessageItemProps[];
}

// Import a default user icon
const defaultUserIcon = require('../assets/images/defaultUserIcon.png'); // Adjust the path as needed

export default function Chat() {
    const [text, onChangeText] = React.useState("");
    const [chatInfo, setChatInfo] = useState<MessageProps>();
    const { roomCode } = useLocalSearchParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imageToZoom, setImageToZoom] = useState<string | null>(null);
    const scrollViewRef = useRef<ScrollView>(null); // Create a ref for the ScrollView

    const formatCurrency = (value: String) => {
        if (value) {
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    }

    const handleNewMessage = () => {
        if (chatInfo && user) {
            socket.emit("sendMessage", {
                roomCode: chatInfo.roomCode,
                senderId: user.id,
                text: text,
                senderN: user.name,
            });
            onChangeText("");
        }
    };

    const handleImagePress = (imageUri: string) => {
        setImageToZoom(imageUri);
        setIsModalVisible(true);
    };

    useLayoutEffect(() => {
        socket.emit("findRoom", roomCode);
        socket.emit("hiddenNotification");
        socket.on("foundRoom", (roomChats: MessageProps) => setChatInfo(roomChats));
    }, [roomCode]);

    useEffect(() => {
        socket.on('createdRoom', (roomChats: MessageProps) => {
            setChatInfo(roomChats);
        });

        socket.on("foundRoom", (roomChats: MessageProps) => setChatInfo(roomChats));

        socket.on("receiveMessage", (newMessage: MessageItemProps) => {
            setChatInfo((prevChatInfo) => {
                if (prevChatInfo) {
                    return {
                        ...prevChatInfo,
                        messages: [...prevChatInfo.messages, newMessage]
                    };
                }
                return prevChatInfo;
            });
            scrollViewRef.current?.scrollToEnd({ animated: true }); // Scroll to the end when a new message is received
            
        });

        return () => {
            socket.off("createdRoom");
            socket.off("foundRoom");
            socket.off("receiveMessage");
        };
    }, [socket]);

    // Scroll to the end when the chatInfo is updated
    useEffect(() => {
        if (chatInfo) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }, [chatInfo]);

    return (
        <View className="w-full h-full bg-[#F9F6FB] p-4 flex flex-col flex-1">
            <View className="flex flex-row gap-4 item-centers border-b-2 border-[#D9D9D9] pb-4">
                <TouchableOpacity onPress={() => handleImagePress(chatInfo?.productImage || '')}>
                    <Image
                        style={{ width: 70, height: 70 }}
                        className="rounded-lg"
                        source={{ uri: chatInfo && chatInfo.productImage }}
                    />
                </TouchableOpacity>
                <View className="flex flex-col gap-1">
                    <Text className="font-bold text-[16px]">{chatInfo && chatInfo.receiverName}</Text>
                    <Text className="font-bold text-[16px]">{chatInfo && chatInfo.productTitle}</Text>
                    <Text className="text-[#9661D9] font-bold">{chatInfo && formatCurrency(chatInfo.productPrice.toString())}đ</Text>
                </View>
            </View>
            <ScrollView ref={scrollViewRef}>
                <View style={{ flex: 1, marginTop: 20, gap: 16 }} className="w-full flex-col items-center gap-y-10">
                    {chatInfo && chatInfo.messages.map((msg, index) => (
                        <View key={index} style={{ alignSelf: msg.senderId === user?.id ? "flex-end" : "flex-start" }} className={`flex-col gap-2 ${msg.senderId === user?.id ? "items-end" : "items-start"}`}>
                            <View className={`flex-row gap-2`} style={{ flexDirection: msg.senderId === user?.id ? "row-reverse" : "row"}}>
                                <Image
                                    style={{ width: 40, height: 40 }}
                                    className="rounded-full"
                                    source={msg.senderId === chatInfo.senderId ? (chatInfo.senderAvatar ? { uri: chatInfo.senderAvatar } : defaultUserIcon) : (chatInfo.receiverAvatar ? { uri: chatInfo.receiverAvatar } : defaultUserIcon)} />
                                <Text className={msg.senderId === chatInfo.senderId ? "relative bg-white rounded-lg py-2 px-3 font-bold shadow-md text-[18px]" : "relative bg-white rounded-lg py-2 px-3 font-bold shadow-md text-[18px]"}>
                                    {msg.text}
                                </Text>
                            </View>
                            <Text className={`font-semibold text-[#808080] text-[12px] pl-[48px] min-w-[190px]`}>
                                {msg.senderN} - {new Date(msg.time).toLocaleTimeString()}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View className="flex flex-row items-center justify-between drop-shadow-lg py-4">
                <TextInput style={{ width: '90%' }}
                    className="bg-white p-4 px-4 text-[#000] rounded-lg font-semibold focus:border-[3px] focus:border-[#9661D9] focus:outline-none"
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Nhắn tin ..."
                />
                <TouchableHighlight
                    onPress={handleNewMessage}
                    underlayColor="#DDDDDD"
                    style={{ padding: 10, alignItems: 'center' }}
                >
                    <Icon name="send" size={30} color={'#9661D9'} />
                </TouchableHighlight>
            </View>
            {imageToZoom && (
                <Modal visible={isModalVisible} transparent={true} onRequestClose={() => setIsModalVisible(false)}>
                    <View style={{ flex: 1, backgroundColor: 'black' }}>
                        <TouchableOpacity
                            style={{ position: 'absolute', top: 40, right: 20, zIndex: 1 }}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Icon name="close" size={30} color="white" />
                        </TouchableOpacity>
                        <ImageViewer
                            imageUrls={[{ url: imageToZoom }]}
                            onCancel={() => setIsModalVisible(false)}
                            enableSwipeDown={true}
                        />
                    </View>
                </Modal>
            )}
        </View>
    );
}