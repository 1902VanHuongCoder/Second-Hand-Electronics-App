import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableHighlight } from 'react-native';
import { useRouter } from 'expo-router';
import { NotificationContext } from '../contexts/NotificationContext';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { Product } from '../types/Product';

export default function HomePage() {
    const router = useRouter();
    const { notifications, showNotification } = useContext(NotificationContext);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [reportVisible, setReportVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const checkAuth = useAuthCheck();
    const [products, setProducts] = useState<Product[]>([]);

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            showNotification("Vui lòng nhập từ khóa tìm kiếm", "error");
            return;
        }
        router.push(`/searchResults?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
    };

    return (
        <View className="p-4 relative" style={{ flex: 1 }}>
            <View className="flex-row justify-between items-center border-b-2 pb-6 pt-2 border-[#D9D9D9]">
                <TextInput
                    className="border-2 border-[#D9D9D9] w-2/3 px-2 py-4 text-[#000] rounded-lg font-semibold"
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                    placeholder="Tìm kiếm ..."
                />
                <TouchableHighlight
                    onPress={handleSearch}
                    className="bg-[#9661D9] px-5 py-4 rounded-lg flex items-center justify-center"
                >
                    <Text className="text-[#fff] font-semibold text-[16px] text-center">
                        Tìm kiếm
                    </Text>
                </TouchableHighlight>
            </View>

            {/* ... rest of the existing JSX ... */}
        </View>
    );
} 