import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTransactionDetails, clearSelectedTransaction } from '../../store/slices/transactionSlice';
import { formatCurrency, formatDate } from '../../utils';

const TransactionDetailsScreen = ({ route, navigation }: any) => {
  const { transactionId } = route.params;
  const dispatch = useAppDispatch();
  const { selectedTransaction, isLoading, error } = useAppSelector((state) => state.transaction);
  
  useEffect(() => {
    loadTransactionDetails();
    
    // Clean up when component unmounts
    return () => {
      dispatch(clearSelectedTransaction());
    };
  }, [transactionId]);
  
  const loadTransactionDetails = async () => {
    if (transactionId) {
      await dispatch(fetchTransactionDetails(transactionId));
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return colors.success;
      case 'PENDING':
        return colors.warning;
      case 'FAILED':
        return colors.danger;
      default:
        return colors.gray[600];
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CREDIT':
        return '↓';
      case 'DEBIT':
        return '↑';
      default:
        return '•';
    }
  };
  
  const handleShareReceipt = async () => {
    if (!selectedTransaction) return;
    
    try {
      const message = `
Transaction Receipt
------------------
ID: ${selectedTransaction.id}
Amount: ${formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
Type: ${selectedTransaction.type}
Status: ${selectedTransaction.status}
Date: ${formatDate(selectedTransaction.createdAt, 'long')}
Description: ${selectedTransaction.description || 'N/A'}
      `;
      
      await Share.share({
        message,
        title: 'Transaction Receipt',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share receipt');
    }
  };
  
  if (isLoading && !selectedTransaction) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading transaction details...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        {selectedTransaction ? (
          <>
            <View style={styles.header}>
              <View style={styles.typeIconContainer}>
                <Text style={styles.typeIcon}>
                  {getTypeIcon(selectedTransaction.type)}
                </Text>
              </View>
              <Text style={styles.amount}>
                {selectedTransaction.type === 'CREDIT' ? '+' : '-'}
                {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(selectedTransaction.status) },
                ]}
              >
                <Text style={styles.statusText}>{selectedTransaction.status}</Text>
              </View>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Transaction Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction ID</Text>
                <Text style={styles.detailValue}>{selectedTransaction.id}</Text>
              </View>
              
              <View style={styles.separator} />
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedTransaction.createdAt, 'long')}
                </Text>
              </View>
              
              <View style={styles.separator} />
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{selectedTransaction.type}</Text>
              </View>
              
              <View style={styles.separator} />
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>
                  {selectedTransaction.description || 'N/A'}
                </Text>
              </View>
              
              {selectedTransaction.fee && (
                <>
                  <View style={styles.separator} />
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fee</Text>
                    <Text style={styles.detailValue}>
                      {formatCurrency(selectedTransaction.fee, selectedTransaction.currency)}
                    </Text>
                  </View>
                </>
              )}
            </View>
            
            {(selectedTransaction.sourceWalletId || selectedTransaction.destinationWalletId) && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Wallet Information</Text>
                
                {selectedTransaction.sourceWalletId && (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>From Wallet</Text>
                      <Text style={styles.detailValue}>
                        {selectedTransaction.sourceWalletName || selectedTransaction.sourceWalletId}
                      </Text>
                    </View>
                    <View style={styles.separator} />
                  </>
                )}
                
                {selectedTransaction.destinationWalletId && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>To Wallet</Text>
                    <Text style={styles.detailValue}>
                      {selectedTransaction.destinationWalletName || selectedTransaction.destinationWalletId}
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            {selectedTransaction.recipientInfo && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Recipient Information</Text>
                
                {selectedTransaction.recipientInfo.name && (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Name</Text>
                      <Text style={styles.detailValue}>
                        {selectedTransaction.recipientInfo.name}
                      </Text>
                    </View>
                    <View style={styles.separator} />
                  </>
                )}
                
                {selectedTransaction.recipientInfo.email && (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Email</Text>
                      <Text style={styles.detailValue}>
                        {selectedTransaction.recipientInfo.email}
                      </Text>
                    </View>
                    <View style={styles.separator} />
                  </>
                )}
                
                {selectedTransaction.recipientInfo.phone && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone</Text>
                    <Text style={styles.detailValue}>
                      {selectedTransaction.recipientInfo.phone}
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareReceipt}
            >
              <Text style={styles.shareButtonText}>Share Receipt</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundTitle}>Transaction Not Found</Text>
            <Text style={styles.notFoundText}>
              The transaction you are looking for could not be found.
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  scrollView: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  typeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  typeIcon: {
    fontSize: typography.fontSize.xxl,
    color: colors.primary,
  },
  amount: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    maxWidth: '60%',
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  shareButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  notFoundContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  notFoundTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  notFoundText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  backButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
});

export default TransactionDetailsScreen;
