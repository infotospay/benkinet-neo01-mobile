import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchWalletDetails, clearSelectedWallet } from '../../store/slices/walletSlice';
import { formatCurrency } from '../../utils';

const WalletDetailsScreen = ({ route, navigation }: any) => {
  const { walletId } = route.params;
  const dispatch = useAppDispatch();
  const { selectedWallet, isLoading, error } = useAppSelector((state) => state.wallet);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWalletDetails();

    // Clean up when component unmounts
    return () => {
      dispatch(clearSelectedWallet());
    };
  }, [walletId]);

  const loadWalletDetails = async () => {
    if (walletId) {
      await dispatch(fetchWalletDetails(walletId));
    }
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadWalletDetails();
  };

  const handleSendMoney = () => {
    navigation.navigate('SendMoney', { walletId });
  };

  const handleRequestMoney = () => {
    navigation.navigate('RequestMoney', { walletId });
  };

  const handleTransactions = () => {
    navigation.navigate('Transactions', { walletId });
  };

  if (isLoading && !refreshing && !selectedWallet) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading wallet details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {selectedWallet ? (
          <>
            <View style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <Text style={styles.walletName}>{selectedWallet.name || 'Wallet'}</Text>
                <View
                  style={[
                    styles.walletStatus,
                    {
                      backgroundColor: selectedWallet.isActive
                        ? colors.success
                        : colors.gray[400],
                    },
                  ]}
                />
              </View>
              <Text style={styles.walletBalance}>
                {formatCurrency(
                  selectedWallet.balance || 0,
                  selectedWallet.currency || 'USD'
                )}
              </Text>
              <View style={styles.walletFooter}>
                <Text style={styles.walletCurrency}>{selectedWallet.currency || 'USD'}</Text>
                <Text style={styles.walletType}>{selectedWallet.type || 'Personal'}</Text>
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleSendMoney}>
                <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                  <Text style={styles.actionIconText}>↑</Text>
                </View>
                <Text style={styles.actionText}>Send</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleRequestMoney}>
                <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
                  <Text style={styles.actionIconText}>↓</Text>
                </View>
                <Text style={styles.actionText}>Request</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleTransactions}>
                <View style={[styles.actionIcon, { backgroundColor: colors.info }]}>
                  <Text style={styles.actionIconText}>≡</Text>
                </View>
                <Text style={styles.actionText}>History</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Wallet Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Wallet ID</Text>
                  <Text style={styles.infoValue}>{selectedWallet.id}</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Currency</Text>
                  <Text style={styles.infoValue}>{selectedWallet.currency}</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Type</Text>
                  <Text style={styles.infoValue}>{selectedWallet.type}</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      {
                        color: selectedWallet.isActive ? colors.success : colors.danger,
                      },
                    ]}
                  >
                    {selectedWallet.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                {selectedWallet.createdAt && (
                  <>
                    <View style={styles.separator} />
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Created</Text>
                      <Text style={styles.infoValue}>
                        {new Date(selectedWallet.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <TouchableOpacity onPress={handleTransactions}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>

              {selectedWallet.transactions && selectedWallet.transactions.length > 0 ? (
                selectedWallet.transactions.slice(0, 5).map((transaction: any, index: number) => (
                  <TouchableOpacity
                    key={transaction.id || index}
                    style={styles.transactionItem}
                    onPress={() =>
                      navigation.navigate('TransactionDetails', {
                        transactionId: transaction.id,
                      })
                    }
                  >
                    <View style={styles.transactionIcon}>
                      <Text style={styles.transactionIconText}>
                        {transaction.type === 'CREDIT' ? '↓' : '↑'}
                      </Text>
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>
                        {transaction.description || 'Transaction'}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.transactionAmount,
                        {
                          color:
                            transaction.type === 'CREDIT' ? colors.success : colors.danger,
                        },
                      ]}
                    >
                      {transaction.type === 'CREDIT' ? '+' : '-'}
                      {formatCurrency(
                        transaction.amount || 0,
                        transaction.currency || selectedWallet.currency
                      )}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>No recent transactions</Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>Wallet Not Found</Text>
            <Text style={styles.emptyStateText}>
              The wallet you are looking for could not be found.
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
  walletCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  walletName: {
    fontSize: typography.fontSize.lg,
    fontWeight: '500',
    color: colors.dark,
  },
  walletStatus: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  walletBalance: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  walletFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletCurrency: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  walletType: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  actionIconText: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  infoValue: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionIconText: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[700],
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  transactionAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing.md,
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

export default WalletDetailsScreen;
