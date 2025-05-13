import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Share,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  fetchScheduledTransactionDetails,
  cancelScheduledTransaction,
  RecurrenceType,
} from '../../../store/slices/scheduledTransactionSlice';
import { colors, spacing, typography, borderRadius, shadows } from '../../../theme';
import { formatCurrency, formatDate } from '../../../utils';

const ScheduledTransactionDetailsScreen = ({ route, navigation }: any) => {
  const { scheduledTransactionId } = route.params;
  const dispatch = useAppDispatch();
  const { selectedScheduledTransaction, isLoading, error } = useAppSelector(
    (state) => state.scheduledTransaction
  );
  
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    loadScheduledTransactionDetails();
  }, [scheduledTransactionId]);
  
  const loadScheduledTransactionDetails = async () => {
    try {
      await dispatch(fetchScheduledTransactionDetails(scheduledTransactionId)).unwrap();
    } catch (error) {
      console.error('Error loading scheduled transaction details:', error);
    }
  };
  
  const handleEditScheduledTransaction = () => {
    navigation.navigate('EditScheduledTransaction', { scheduledTransactionId });
  };
  
  const handleCancelTransaction = async () => {
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
              setIsDeleting(true);
              await dispatch(cancelScheduledTransaction(scheduledTransactionId)).unwrap();
              Alert.alert('Success', 'Scheduled transaction cancelled successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel scheduled transaction');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };
  
  const handleShareTransaction = async () => {
    if (!selectedScheduledTransaction) return;
    
    const { amount, currency, description, scheduledDate, recurrenceType } = selectedScheduledTransaction;
    
    const recurrenceText = 
      recurrenceType === RecurrenceType.ONCE
        ? 'One-time'
        : recurrenceType === RecurrenceType.DAILY
        ? 'Daily'
        : recurrenceType === RecurrenceType.WEEKLY
        ? 'Weekly'
        : 'Monthly';
    
    const message = `Scheduled Transaction Details:
Amount: ${formatCurrency(amount, currency)}
Description: ${description || 'No description'}
Scheduled Date: ${formatDate(scheduledDate)}
Recurrence: ${recurrenceText}`;
    
    try {
      await Share.share({
        message,
        title: 'Scheduled Transaction Details',
      });
    } catch (error) {
      console.error('Error sharing transaction:', error);
    }
  };
  
  if (isLoading && !selectedScheduledTransaction) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading transaction details...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadScheduledTransactionDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (!selectedScheduledTransaction) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Transaction Not Found</Text>
        <Text style={styles.errorText}>The requested transaction could not be found.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const {
    amount,
    currency,
    description,
    scheduledDate,
    recurrenceType,
    recurrenceEndDate,
    status,
    sourceWalletId,
    destinationWalletId,
    recipientInfo,
    createdAt,
  } = selectedScheduledTransaction;
  
  const isPending = status === 'PENDING';
  const isRecurring = recurrenceType !== RecurrenceType.ONCE;
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Scheduled Transaction</Text>
            <Text style={styles.subtitle}>
              {formatDate(scheduledDate)}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              status === 'PENDING' && styles.pendingStatusBadge,
              status === 'COMPLETED' && styles.completedStatusBadge,
              status === 'CANCELLED' && styles.cancelledStatusBadge,
              status === 'FAILED' && styles.failedStatusBadge,
            ]}
          >
            <Text style={styles.statusBadgeText}>{status}</Text>
          </View>
        </View>
        
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>
            {formatCurrency(amount, currency)}
          </Text>
        </View>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{description || 'No description'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Recurrence</Text>
            <Text style={styles.detailValue}>
              {recurrenceType === RecurrenceType.ONCE
                ? 'One-time'
                : recurrenceType === RecurrenceType.DAILY
                ? 'Daily'
                : recurrenceType === RecurrenceType.WEEKLY
                ? 'Weekly'
                : 'Monthly'}
            </Text>
          </View>
          
          {isRecurring && recurrenceEndDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>End Date</Text>
              <Text style={styles.detailValue}>{formatDate(recurrenceEndDate)}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Source Wallet</Text>
            <Text style={styles.detailValue}>{sourceWalletId}</Text>
          </View>
          
          {destinationWalletId && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Destination Wallet</Text>
              <Text style={styles.detailValue}>{destinationWalletId}</Text>
            </View>
          )}
          
          {recipientInfo && (
            <>
              {recipientInfo.name && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Recipient Name</Text>
                  <Text style={styles.detailValue}>{recipientInfo.name}</Text>
                </View>
              )}
              
              {recipientInfo.email && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Recipient Email</Text>
                  <Text style={styles.detailValue}>{recipientInfo.email}</Text>
                </View>
              )}
              
              {recipientInfo.phone && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Recipient Phone</Text>
                  <Text style={styles.detailValue}>{recipientInfo.phone}</Text>
                </View>
              )}
            </>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>{formatDate(createdAt)}</Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          {isPending && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryActionButton]}
                onPress={handleEditScheduledTransaction}
              >
                <Text style={styles.primaryActionButtonText}>Edit Transaction</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.dangerActionButton]}
                onPress={handleCancelTransaction}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.dangerActionButtonText}>Cancel Transaction</Text>
                )}
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={handleShareTransaction}
          >
            <Text style={styles.secondaryActionButtonText}>Share Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
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
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
    fontWeight: '500',
  },
  amountCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  amountLabel: {
    fontSize: typography.fontSize.md,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
  amountValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.white,
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  detailRow: {
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: spacing.xl,
  },
  actionButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  primaryActionButton: {
    backgroundColor: colors.primary,
  },
  primaryActionButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: typography.fontSize.md,
  },
  secondaryActionButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryActionButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: typography.fontSize.md,
  },
  dangerActionButton: {
    backgroundColor: colors.danger,
  },
  dangerActionButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: typography.fontSize.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.light,
  },
  errorTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.danger,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: typography.fontSize.md,
  },
});

export default ScheduledTransactionDetailsScreen;
