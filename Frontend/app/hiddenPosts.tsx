import { Text, View, StyleSheet, TouchableHighlight, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from 'expo-router';
import Notification from "@/components/Notification";
import { NotificationContext } from "@/context/NotificationContext";
import axios from 'axios';

export default function HiddenPosts() {
    const { id } = useLocalSearchParams();
    const options = [
        { id: '1', label: 'Không muốn bán nữa' },
        { id: '2', label: 'Đã bán qua trang của 2HAND MARKET' },
        { id: '3', label: 'Đã bán qua các kênh khác' },
        { id: '4', label: 'Tôi bị làm phiền vì môi giới/dịch vụ đăng tin' },
        { id: '5', label: 'Khác' },
    ];
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const { notifications, showNotification } = useContext(NotificationContext);
    const router = useRouter();
    const toggleHiddenPosts = async () => {
        if (!selectedOption) {
            showNotification('Vui lòng chọn lí do ẩn tin', 'error');
            return;
        }

        try {
            const reason = options.find(op => op.id === selectedOption)?.label;
            const response = await axios.patch(`http://10.0.2.2:5000/api/products/hiddenPost/${id}`, { reason });

            showNotification('Ẩn tin thành công.', 'success');
            setTimeout(() => {
                router.back();
            }, 1000);
        } catch (err) {
            showNotification(err || "Có lỗi xảy ra", 'error');
        }
    }

    return (
        <View className="relative w-full h-full bg-white p-4 flex-col">
            <Notification
                message={notifications.message}
                type={notifications.type}
                visible={notifications.visible}
            />
            <View style={{ flex: 1 }}>
                <Text className="text-[20px]">Khi bạn đã bán được hàng, hoặc không muốn tin xuất hiện trên <Text className="font-bold">2HAND MARKET</Text>, hãy chọn "Ẩn tin".</Text>
                <Text className="font-bold text-[18px] mt-4 mb-6">Vui lòng chọn lí do ẩn tin</Text>
                <ScrollView>
                    {options.map(option => (
                        <TouchableOpacity
                            key={option.id}
                            style={[styles.option, selectedOption === option.id && styles.selectedOption]}
                            onPress={() => setSelectedOption(option.id)}
                        >
                            <View style={styles.radioCircle}>
                                {selectedOption === option.id && <View style={styles.selectedRb} />}
                            </View>
                            <Text style={styles.optionText}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <View className="flex-row gap-5 items-center justify-center">
                <TouchableHighlight className="w-1/2 border-2 border-[#333] px-[18px] py-3 rounded-lg flex items-center justify-center">
                    <View className="flex-row items-center justify-center gap-2">
                        <Text className="font-bold text-[18px] text-[#333]">Hủy</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={toggleHiddenPosts}
                    className="rounded-lg w-1/2 ">
                    <LinearGradient
                        colors={['#523471', '#9C62D7']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={{ paddingTop: 12.5, paddingBottom: 12.5, borderRadius: 8 }}
                    >
                        <View className="flex-row items-center justify-center gap-2">
                            <Text className="font-bold text-[18px] text-[#fff]">Ẩn tin</Text>
                        </View>
                    </LinearGradient>
                </TouchableHighlight>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRb: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#9661D9',
    },
    optionText: {
        fontSize: 16,
    },
    selectedOption: {
        backgroundColor: '#FFFFFF',
    },
});