import { Text, View, Image, TextInput, ScrollView, TouchableHighlight } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import socket from "@/utils/socket";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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

export default function Chat() {
    const [text, onChangeText] = React.useState("");
    const [chatInfo, setChatInfo] = useState<MessageProps>();
    const { roomCode } = useLocalSearchParams();
    const { user } = useSelector((state: RootState) => state.auth);

    console.log(user);

    const formatCurrency = (value: String) => {
        if (value) {
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    }


    const handleNewMessage = () => {

        if (chatInfo && user) {
            socket.emit("newMessage", {
                roomCode: chatInfo.roomCode,
                senderId: user.id,
                text: text, 
                senderN: user.name,
            });
            onChangeText("");
        }
    };

    useLayoutEffect(() => {
        socket.emit("findRoom", roomCode);
        socket.on("foundRoom", (roomChats: MessageProps) => setChatInfo(roomChats));
    }, [roomCode]);

    useLayoutEffect(() => {
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
        });
        return () => {
            socket.off("foundRoom");
            socket.off("receiveMessage");
        };
    }, [socket]);

    return (
        <View className="w-full h-full bg-white p-4 flex flex-col flex-1">
            <View className="flex-row gap-1 border-b-2 border-[#D9D9D9] pb-4">
                <Image
                    style={{ width: 70, height: 70 }}
                    className="rounded-lg"
                    source={{ uri: chatInfo && chatInfo.productImage }}
                />
                <View>
                    <Text className="font-bold text-[16px]">{chatInfo && chatInfo.productTitle}</Text>
                    <Text className="text-[#9661D9] font-bold">{chatInfo && formatCurrency(chatInfo.productPrice.toString())}đ</Text>
                </View>
            </View>
            <ScrollView>
                <View style={{ flex: 1, marginTop: 20, gap: 16 }} className="w-full flex-col items-center">
                    {chatInfo && chatInfo.messages.map((msg, index) => (
                        <View key={index} style={{ alignSelf: msg.senderId === user?.id ? "flex-end" : "flex-start" }} className="flex-col gap-1">
                            <Text className={msg.senderId === chatInfo.senderId ? "bg-[#9661D9] rounded-lg p-3 font-bold text-white" : "bg-[#D9D9D9] rounded-lg p-3 font-bold"}>
                                {msg.text}
                            </Text>
                            <Text style={{ alignSelf: msg.senderId === chatInfo.senderId ? "flex-start" : "flex-end" }} className="font-semibold text-[#808080] text-[12px]">
                                {msg.senderN} - {new Date(msg.time).toLocaleTimeString()}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={{ gap: 32 }} className="flex-row items-center justify-center">
                <TextInput style={{ width: '80%' }}
                    className="bg-[#D9D9D9] p-4 text-[#000] rounded-lg font-semibold"
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
        </View>
    );
}