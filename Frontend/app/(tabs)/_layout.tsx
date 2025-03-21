import { Tabs, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { AuthProvider } from '@/context/AuthContext';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePathname } from 'expo-router';
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from '@expo/vector-icons';
import { RootState, store } from '@/store/store';
import socket from '@/utils/socket';

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

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  // const [rooms, setRooms] = useState<MessageProps[]>([]);
  const [count, setCount] = useState(0);
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    function fetchGroups() {
      fetch("http://10.0.2.2:5000/api/chat")
        .then((res) => res.json())
        .then((data) => {
          if (user) {
            const filteredRooms = data.filter((room: MessageProps) => room.senderId === user.id || room.receiverId === user.id);
            let count = 0; 
            filteredRooms.forEach((room: MessageProps) => {
              if(user.id === room.senderId){
                count += room.senderMessagesNotRead.length;
              }else{
                count += room.receiverMessagesNotRead.length;
              }
            });
            setCount(count);
          }
        })
        .catch((err) => console.error(err));
    }
    if (user) {
      fetchGroups();
    }
  }, [user]);

  useEffect(() => {
    socket.on("deleteNotification",(updateMessageList: MessageProps[]) => {
        if (user) {
            const filteredRooms = updateMessageList.filter((room: MessageProps) => room.senderId === user.id || room.receiverId === user.id);
            let count = 0; 
            filteredRooms.forEach((room: MessageProps) => {
              if(user.id === room.senderId){
                count += room.senderMessagesNotRead.length;
              }else{
                count += room.receiverMessagesNotRead.length;
              }
            });
            setCount(count);
        }
    })

    socket.on("newMessageCreated", (updateMessageList: MessageProps[]) => {
        if (user) { 
            const filteredRooms = updateMessageList.filter((room: MessageProps) => room.senderId === user.id || room.receiverId === user.id);
            let count = 0; 
            filteredRooms.forEach((room: MessageProps) => {
              if(user.id === room.senderId){
                count += room.senderMessagesNotRead.length;
              }else{
                count += room.receiverMessagesNotRead.length;
              }
            });
            setCount(count);
        }
    });

  
    return () => {
        socket.off("newMessageCreated"); 
        socket.off("deleteNotification");
    };
}, [socket, user]);


  return (

    <Provider store={store}>
      <AuthProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#9661D9',
            headerShown: true,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            headerStyle: styles.header,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            },
            headerShadowVisible: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            ),
            tabBarStyle: Platform.select({
              ios: {
                position: 'absolute',
                borderTopWidth: 0,
                height: 70,
                paddingBottom: 10,
                paddingTop: 10,
                paddingHorizontal: 10,
              },
              android: {
                backgroundColor: '#fff',
                height: 70,
                paddingBottom: 10,
                paddingTop: 10,
                paddingHorizontal: 10,
              },
              default: {},
            }),
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Trang chủ',
              headerShown: false,
              tabBarIcon: ({ color }) => <IconSymbol size={25} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="postManagement"
            options={{
              title: 'Quản lý tin',
              tabBarIcon: ({ color }) => <Icon size={25} name="list" color={color} />,
            }}
          />
          <Tabs.Screen
            name="postCreation"
            options={{
              title: "Đăng tin", // Set the title directly
              tabBarIconStyle: { marginBottom: 10, height: 70, backgroundColor: '#ffffff', width: 70, borderRadius: 40, color: '#9661D9', borderColor: '#9661D9', borderWidth: 4, transform: [{ translateY: -30 }] },
              tabBarIcon: ({ color }) => <Ionicons size={40} name="add-outline" color={color} />,
              tabBarStyle: {
                // backgroundColor: 'blue', // Đổi màu nền của tab này
                paddingHorizontal: 10, // Thêm padding cho tab này
                height: 70, // Thay đổi chiều cao của tab này
                paddingTop: 10, // Thêm padding cho tab này
              },
            }}
          />
          <Tabs.Screen
            name="messageList"
            options={{
              title: 'Tin nhắn',
              tabBarIcon: ({ color }) => <Icon size={25} name="comments" color={color} />,
              tabBarBadge: count > 0 ? count : undefined,
            }}
          />
          <Tabs.Screen
            name="userProfile"
            options={{
              title: 'Tài khoản',
              tabBarIcon: ({ color }) => <Icon size={25} name="user-circle" color={color} />,
            }}
          />
        </Tabs>
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#9661D9',
    height: 80,
    color: 'white',
  }
});