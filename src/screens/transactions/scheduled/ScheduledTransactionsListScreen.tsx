import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  fetchScheduledTransactions,
  cancelScheduledTransaction,
  RecurrenceType,
} from '../../../store/slices/scheduledTransactionSlice';
import { colors, spacing, typography, borderRadius, shadows } from '../../../theme';
import { formatCurrency, formatDate } from '../../../utils';

const ScheduledTransactionsListScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { scheduledTransactions, isLoading, error } = useAppSelector(
    (state) => state.scheduledTransaction
  );
  
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  
  useEffect(() => {
    loadScheduledTransactions();
  }, []);
  
  const loadScheduledTransactions = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchScheduledTransactions()).unwrap();
    } catch (error) {
      console.error('Error loading scheduled transactions:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const onRefresh = useCallback(() => {
    loadScheduledTransactions();
  }, []);
  
  const handleCreateScheduledTransaction = () => {
    navigation.navigate('CreateScheduledTransaction');
  };
  
  const handleScheduledTransactionPress = (scheduledTransactionId: string) => {
    navigation.navigate('ScheduledTransactionDetails', { scheduledTransactionId });
  };
  
  const handleCancelTransaction = async (scheduledTransactionId: string) => {
    Alert.alert(
      'Cancel Scheduled Transaction',
      'Are you sure you want to cancel this scheduled transaction?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(cancelScheduledTransaction(scheduledTransactionId)).unwrap();
              Alert.alert('Success', 'Scheduled transaction cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel scheduled transaction');
            }
          },
        },
      ]
    );
  };
  
  const getFilteredTransactions = () => {
    if (!filter) return scheduledTransactions;
    
    return scheduledTransactions.filter(transaction => {
      if (filter === 'PENDING') return transaction.status === 'PENDING';
      if (filter === 'COMPLETED') return transaction.status === 'COMPLETED';
      if (filter === 'CANCELLED') return transaction.status === 'CANCELLED';
      if (filter === 'ONCE') return transaction.recurrenceType === RecurrenceType.ONCE;
      if (filter === 'RECURRING') return transaction.recurrenceType !== RecurrenceType.ONCE;
      return true;
    });
  };
  
  const renderFilterOption = (label: string, value: string | null) => (
    <TouchableOpacity
      style={[styles.filterOption, filter === value && styles.activeFilterOption]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[styles.filterOptionText, filter === value && styles.activeFilterOptionText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const renderScheduledTransactionItem = ({ item }: { item: any }) => {
    const isRecurring = item.recurrenceType !== RecurrenceType.ONCE;
    const isPending = item.status === 'PENDING';
    
    return (
      <TouchableOpacity
        style={[
          styles.transactionItem,
          !isPending && styles.completedTransactionItem,
        ]}
        onPress={() => handleScheduledTransactionPress(item.id)}
      >
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionAmount}>
              {formatCurrency(item.amount, item.currency)}
            </Text>
            <Text style={styles.transactionDate}>
              {formatDate(item.scheduledDate)}
            </Text>
          </View>
          <View style={styles.transactionStatus}>
            {isRecurring && (
              <View style={styles.recurringBadge}>
                <Text style={styles.recurringBadgeText}>Recurring</Text>
              </View>
            )}
            <View
              style={[
                styles.statusBadge,
                item.status === 'PENDING' && styles.pendingStatusBadge,
                item.status === 'COMPLETED' && styles.completedStatusBadge,
                item.status === 'CANCELLED' && styles.cancelledStatusBadge,
                item.status === 'FAILED' && styles.failedStatusBadge,
              ]}
            >
              <Text style={styles.statusBadgeText}>{item.status}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription} numberOfLines={1}>
            {item.description || 'No description'}
          </Text>
          <Text style={styles.transactionRecurrence}>
            {item.recurrenceType === RecurrenceType.ONCE
              ? 'One-time'
              : item.recurrenceType === RecurrenceType.DAILY
              ? 'Daily'
              : item.recurrenceType === RecurrenceType.WEEKLY
              ? 'Weekly'
              : 'Monthly'}
          </Text>
        </View>
        
        {isPending && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelTransaction(item.id)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Scheduled Transactions</Text>
      <Text style={styles.emptyText}>
        You don't have any scheduled transactions yet. Create one to get started.
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateScheduledTransaction}
      >
        <Text style={styles.createButtonText}>Create Scheduled Transaction</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scheduled Transactions</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreateScheduledTransaction}
        >
          <Text style={styles.addButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterOption('All', null)}
          {renderFilterOption('Pending', 'PENDING')}
          {renderFilterOption('Completed', 'COMPLETED')}
          {renderFilterOption('Cancelled', 'CANCELLED')}
          {renderFilterOption('One-time', 'ONCE')}
          {renderFilterOption('Recurring', 'RECURRING')}
        </ScrollView>
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <FlatList
        data={getFilteredTransactions()}
        renderItem={renderScheduledTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyList}
      />
      
      {isLoading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
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
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: typography.fontSize.sm,
  },
  filterContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
    ...shadows.xs,
  },
  filterOption: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.light,
  },
  activeFilterOption: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  activeFilterOptionText: {
    color: colors.white,
    fontWeight: '500',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  transactionItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  completedTransactionItem: {
    opacity: 0.8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  transactionDate: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  transactionStatus: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  recurringBadge: {
    backgroundColor: colors.info + '20', // 20% opacity
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  recurringBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.info,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[300],
  },
  pendingStatusBadge: {
    backgroundColor: colors.warning + '20', // 20% opacity
  },
  completedStatusBadge: {
    backgroundColor: colors.success + '20', // 20% opacity
  },
  cancelledStatusBadge: {
    backgroundColor: colors.gray[300] + '80', // 50% opacity
  },
  failedStatusBadge: {
    backgroundColor: colors.danger + '20', // 20% opacity
  },
  statusBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[700],
    fontWeight: '500',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  transactionDescription: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    flex: 1,
    marginRight: spacing.sm,
  },
  transactionRecurrence: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  cancelButton: {
    backgroundColor: colors.light,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  cancelButtonText: {
    color: colors.danger,
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
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
    marginBottom: spacing.lg,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  createButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: typography.fontSize.md,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScheduledTransactionsListScreen;
