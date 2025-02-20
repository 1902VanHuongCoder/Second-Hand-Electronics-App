import { Text, View, Image,} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';

export default function welcomePage() {
    return (
        <View>
            <View className='relative bg-[#9661D9] w-full min-h-screen items-center'>
                <View className="items-center mt-24">
                    <Image style={{ width: 300, height: 40 }} source={require('../assets/images/2HAND MARKET.png')} />
                    <Image className="w-[350px] h-[350px]" source={require('../assets/images/image 2.png')} />
                </View>
                <Image style={{ width: '100%' }} className='absolute bottom-0' source={require('../assets/images/Vector 8.png')} />
                <View className='absolute bottom-20 flex-row justify-center items-center gap-10'>
                    <Link href="/signup">
                        <View className='border-4 border-[#9661D9] px-10 py-3 rounded-2xl'>
                            <Text className='text-[#9661D9] text-center text-[20px] font-bold'>Đăng ký</Text>
                        </View>
                    </Link>
                    <Link href="/login">
                        <View className='bg-[#9661D9] px-8 py-4 rounded-2xl'>
                            <Text className='text-[#fff] text-center text-[20px] font-bold'>Đăng nhập</Text>
                        </View>
                    </Link>
                </View>
            </View>
        </View>
    );
}