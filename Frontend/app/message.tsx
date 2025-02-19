import { Text, View, Image, TextInput, ScrollView, TouchableHighlight } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";

// Định nghĩa kiểu cho ảnh và video
interface Media {
    uri: string;
}
export default function Message() {
    const [text, onChangeText] = React.useState("");
    const [images, setImages] = useState<Media[]>([]); // Định nghĩa kiểu cho images
    
    return (
        <View className="w-full h-full bg-white p-4 flex flex-col flex-1">
            <View className="flex-row gap-1 border-b-2 border-[#D9D9D9] pb-4">
                <Image
                    style={{ width: 70, height: 70 }}
                    className="rounded-lg"
                    source={require("../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg")}
                />
                <View>
                    <Text className="font-bold text-[16px]">IPhone 16 Pro Max</Text>
                    <Text className="text-[#9661D9] font-bold">9.000.000 đ</Text>
                </View>
            </View>
            <ScrollView>
                <View style={{ flex: 1, marginTop: 20, gap: 16 }} className="w-full flex-col items-center">
                    <View style={{ alignSelf: "flex-start" }} className="flex-col gap-1">
                        <Text className="bg-[#D9D9D9] rounded-lg p-3 font-bold">Hàng còn mới không bạn?</Text>
                        <Text style={{ alignSelf: "flex-end" }} className="font-semibold text-[#808080] text-[12px]">14.56.03</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }} className="flex-col gap-1">
                        <Text className="bg-[#9661D9] rounded-lg p-3 font-bold text-white">Hàng 99% nha</Text>
                        <Text style={{ alignSelf: "flex-start" }} className="font-semibold text-[#808080] text-[12px]">15.56.05</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }} className="flex-col gap-1">
                        <Image style={{ width: 120, height: 120 }} className="rounded-lg" source={require('../assets/images/20220919_165809.jpg')} />
                        <Text style={{ alignSelf: "flex-start" }} className="font-semibold text-[#808080] text-[12px]">15.56.05</Text>
                    </View>
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
                    onPress={() => { }}
                    underlayColor="#DDDDDD"
                    style={{ padding: 10, alignItems: 'center' }}
                >
                    <Icon name="image" size={30} color={'#9661D9'} />
                </TouchableHighlight>
            </View>
        </View>
    );
}