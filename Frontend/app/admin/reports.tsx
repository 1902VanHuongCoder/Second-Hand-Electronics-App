import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { NotificationContext } from '@/context/NotificationContext';
import Notification from '@/components/Notification';
import rootURL from '@/utils/backendRootURL';
interface Report {
  _id: string;
  productId: {
    _id: string;
    title: string;
    images: string[];
    price: number;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export default function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, showNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      showNotification('Bạn không có quyền truy cập trang này', 'error');
      router.push('/');
      return;
    }

    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{data: Report[]}>(`${rootURL}/api/reports`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      setReports(response.data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      showNotification('Không thể tải danh sách báo cáo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: 'pending' | 'reviewed' | 'resolved') => {
    try {
      await axios.patch(`${rootURL}/api/reports/${reportId}`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );
      
      showNotification('Cập nhật trạng thái báo cáo thành công', 'success');
      
      // Cập nhật danh sách báo cáo
      setReports(reports.map(report => 
        report._id === reportId ? { ...report, status } : report
      ));
    } catch (error) {
      console.error('Error updating report status:', error);
      showNotification('Không thể cập nhật trạng thái báo cáo', 'error');
    }
  };

  const handleStatusChange = (reportId: string) => {
    Alert.alert(
      'Cập nhật trạng thái',
      'Chọn trạng thái mới cho báo cáo này',
      [
        { text: 'Đang chờ xử lý', onPress: () => updateReportStatus(reportId, 'pending') },
        { text: 'Đã xem xét', onPress: () => updateReportStatus(reportId, 'reviewed') },
        { text: 'Đã giải quyết', onPress: () => updateReportStatus(reportId, 'resolved') },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFC107';
      case 'reviewed': return '#2196F3';
      case 'resolved': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Đang chờ xử lý';
      case 'reviewed': return 'Đã xem xét';
      case 'resolved': return 'Đã giải quyết';
      default: return 'Không xác định';
    }
  };

  const renderItem = ({ item }: { item: Report }) => (
    <View style={styles.reportItem}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle}>Báo cáo bài đăng: {item.productId.title}</Text>
        <TouchableOpacity
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
          onPress={() => handleStatusChange(item._id)}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.reportInfo}>Người báo cáo: {item.userId.name}</Text>
      <Text style={styles.reportInfo}>Lý do: {item.reason}</Text>
      {item.description ? (
        <Text style={styles.reportInfo}>Mô tả: {item.description}</Text>
      ) : null}
      <Text style={styles.reportDate}>Ngày báo cáo: {formatDate(item.createdAt)}</Text>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => router.push(`/postDetails?id=${item.productId._id}`)}
        >
          <Text style={styles.buttonText}>Xem bài đăng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9661D9" />
        <Text>Đang tải danh sách báo cáo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Notification
        message={notifications.message}
        type={notifications.type}
        visible={notifications.visible}
      />
      <Text style={styles.header}>Quản lý báo cáo</Text>
      
      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có báo cáo nào</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  reportItem: {
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reportInfo: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  reportDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  viewButton: {
    backgroundColor: '#9661D9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
}); 