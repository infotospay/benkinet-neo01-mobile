import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  NotificationType,
  NotificationPriority,
} from '../../store/slices/notificationSlice';
import { formatDate } from '../../utils';

const NotificationsListScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading, error } = useAppSelector(
    (state) => state.notification
  );
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  useEffect(() => {
    loadNotifications();
  }, []);
  
  const loadNotifications = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchNotifications()).unwrap();
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      Alert.alert('No Unread Notifications', 'All notifications are already read.');
      return;
    }
    
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      Alert.alert('Success', 'All notifications marked as read.');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      Alert.alert('Error', 'Failed to mark all notifications as read. Please try again.');
    }
  };
  
  const handleNotificationPress = async (notification: any) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await dispatch(markNotificationAsRead(notification.id)).unwrap();
    }
    
    // Navigate based on notification type and data
    switch (notification.type) {
      case NotificationType.TRANSACTION:
        if (notification.data?.transactionId) {
          navigation.navigate('TransactionDetails', {
            transactionId: notification.data.transactionId,
          });
        } else if (notification.data?.walletId) {
          navigation.navigate('WalletDetails', {
            walletId: notification.data.walletId,
          });
        } else {
          navigation.navigate('Transactions');
        }
        break;
        
      case NotificationType.SECURITY:
        navigation.navigate('Security');
        break;
        
      case NotificationType.MARKETING:
        // Just display the notification details
        Alert.alert(notification.title, notification.message);
        break;
        
      case NotificationType.SYSTEM:
        // Just display the notification details
        Alert.alert(notification.title, notification.message);
        break;
        
      default:
        // Just display the notification details
        Alert.alert(notification.title, notification.message);
    }
  };
  
  const onRefresh = useCallback(() => {
    loadNotifications();
  }, []);
  
  const filterNotifications = () => {
    if (!selectedType) {
      return notifications;
    }
    
    return notifications.filter((notification) => notification.type === selectedType);
  };
  
  const renderNotificationItem = ({ item }: { item: any }) => {
    const priorityColor =
      item.priority === NotificationPriority.HIGH
        ? colors.danger
        : item.priority === NotificationPriority.MEDIUM
        ? colors.warning
        : colors.gray[400];
    
    const typeIcon =
      item.type === NotificationType.TRANSACTION
        ? '💰'
        : item.type === NotificationType.SECURITY
        ? '🔒'
        : item.type === NotificationType.SYSTEM
        ? '⚙️'
        : '📢';
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.isRead && styles.unreadNotificationItem,
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View
          style={[
            styles.notificationPriorityIndicator,
            { backgroundColor: priorityColor },
          ]}
        />
        
        <View style={styles.notificationIconContainer}>
          <Text style={styles.notificationIcon}>{typeIcon}</Text>
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text
              style={[
                styles.notificationTitle,
                !item.isRead && styles.unreadNotificationTitle,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={styles.notificationDate}>
              {formatDate(item.createdAt, 'relative')}
            </Text>
          </View>
          
          <Text
            style={[
              styles.notificationMessage,
              !item.isRead && styles.unreadNotificationMessage,
            ]}
            numberOfLines={2}
          >
            {item.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderTypeFilter = () => {
    const types = [
      { id: null, name: 'All' },
      { id: NotificationType.TRANSACTION, name: 'Transactions' },
      { id: NotificationType.SECURITY, name: 'Security' },
      { id: NotificationType.SYSTEM, name: 'System' },
      { id: NotificationType.MARKETING, name: 'Marketing' },
    ];
    
    return (
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {types.map((type) => (
            <TouchableOpacity
              key={type.id || 'all'}
              style={[
                styles.filterOption,
                selectedType === type.id && styles.selectedFilterOption,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  selectedType === type.id && styles.selectedFilterOptionText,
                ]}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyText}>
        {selectedType
          ? `You don't have any ${selectedType.toLowerCase()} notifications`
          : 'You don\'t have any notifications yet'}
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity
          style={styles.markAllButton}
          onPress={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <Text
            style={[
              styles.markAllButtonText,
              unreadCount === 0 && styles.disabledButtonText,
            ]}
          >
            Mark All as Read
          </Text>
        </TouchableOpacity>
      </View>
      
      {renderTypeFilter()}
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <FlatList
        data={filterNotifications()}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.dark,
  },
  markAllButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  markAllButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  disabledButtonText: {
    color: colors.gray[400],
  },
  filterContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  filterScrollContent: {
    paddingHorizontal: spacing.md,
  },
  filterOption: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  selectedFilterOption: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  selectedFilterOptionText: {
    color: colors.white,
    fontWeight: '500',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.sm,
    overflow: 'hidden',
  },
  unreadNotificationItem: {
    backgroundColor: colors.primary + '05', // 5% opacity
  },
  notificationPriorityIndicator: {
    width: 4,
    height: '100%',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacing.md,
  },
  notificationIcon: {
    fontSize: typography.fontSize.md,
  },
  notificationContent: {
    flex: 1,
    padding: spacing.md,
    paddingLeft: 0,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  notificationTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    flex: 1,
    marginRight: spacing.sm,
  },
  unreadNotificationTitle: {
    fontWeight: 'bold',
  },
  notificationDate: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
  notificationMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  unreadNotificationMessage: {
    color: colors.dark,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSize.sm,
    margin: spacing.md,
    textAlign: 'center',
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
});

export default NotificationsListScreen;
