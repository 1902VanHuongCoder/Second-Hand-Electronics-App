import { Text, View, SafeAreaView, TouchableHighlight, TextInput, Image } from 'react-native'
import React, { Component } from 'react'

export default function ListChats() {
    const [text, onChangeText] = React.useState("");
    return (
        <SafeAreaView className="p-4" style={{ flex: 1 }}>
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
            <View className='flex-row justify-between border-b-2 border-[#D9D9D9] pb-4 mb-4'>
                <View className='flex-row gap-2'>
                    <Image style={{ width: 70, height: 70 }} className='rounded-full' source={require('../assets/images/z6186705977978_00edd678a64db50dba5ef61a50391611.jpg')} />
                    <View className='flex-col gap-1'>
                        <Text className='font-bold text-[18px]'>Hoàng Anh</Text>
                        <Text className='text-[14px] text-[#808080] font-bold'>IPhone 16 Pro Max</Text>
                        <Text className='text-[12px] text-[#808080] font-medium'>Hàng mới không ?</Text>
                    </View>
                </View>
                <Image style={{ width: 70, height: 70 }} className='rounded-md' source={require('../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg')} />
            </View>
            <View className='flex-row justify-between border-b-2 border-[#D9D9D9] pb-4 mb-4'>
                <View className='flex-row gap-2'>
                    <Image style={{ width: 70, height: 70 }} className='rounded-full' source={require('../assets/images/z6186705977978_00edd678a64db50dba5ef61a50391611.jpg')} />
                    <View className='flex-col gap-1'>
                        <Text className='font-bold text-[18px]'>Hoàng Anh</Text>
                        <Text className='text-[14px] text-[#808080] font-bold'>IPhone 16 Pro Max</Text>
                        <Text className='text-[12px] text-[#808080] font-medium'>Hàng mới không ?</Text>
                    </View>
                </View>
                <Image style={{ width: 70, height: 70 }} className='rounded-md' source={require('../assets/images/z6316149378615_f6d6f665171bf597c35f86bf13ca61b2.jpg')} />
            </View>
        </SafeAreaView>
    );
}