import React, { useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { NotificationContext } from '@/context/NotificationContext';
import Notification from '@/components/Notification';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, showNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      showNotification('Bạn không có quyền truy cập trang này', 'error');
      router.push('/');
    }
  }, [user]);

  const adminMenuItems = [
    {
      title: 'Quản lý báo cáo',
      icon: 'warning-outline',
      route: '/admin/reports',
      description: 'Xem và xử lý các báo cáo từ người dùng'
    },
    {
      title: 'Quản lý người dùng',
      icon: 'people-outline',
      route: '/admin/users',
      description: 'Quản lý tài khoản người dùng'
    },
    {
      title: 'Quản lý sản phẩm',
      icon: 'cube-outline',
      route: '/admin/products',
      description: 'Quản lý sản phẩm trên hệ thống'
    },
    {
      title: 'Cài đặt hệ thống',
      icon: 'settings-outline',
      route: '/admin/settings',
      description: 'Cấu hình và cài đặt hệ thống'
    }
  ];

  const renderMenuItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.menuItem}
      onPress={() => router.push(item.route)}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons name={item.icon} size={32} color="#9661D9" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#9661D9" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Notification
        message={notifications.message}
        type={notifications.type}
        visible={notifications.visible}
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bảng điều khiển Admin</Text>
        <Text style={styles.headerSubtitle}>
          Xin chào, {user?.name || 'Admin'}
        </Text>
      </View>
      
      <ScrollView style={styles.menuContainer}>
        {adminMenuItems.map(renderMenuItem)}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/')}
      >
        <Ionicons name="home-outline" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F4E9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9661D9',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 