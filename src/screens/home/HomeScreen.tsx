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
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';
import { getUser, logout } from '../../utils/authUtils';
import { formatCurrency } from '../../utils';

const HomeScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get user data from storage
      const userData = await getUser();
      setUser(userData);

      // Fetch wallets
      const walletsResponse = await apiService.getWallets();
      setWallets(walletsResponse.data || []);

      // Fetch recent transactions
      const transactionsResponse = await apiService.getTransactions({
        limit: 5,
        sort: 'createdAt:desc',
      });
      setTransactions(transactionsResponse.data || []);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setError(errorResponse.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUserData();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSendMoney = () => {
    // Will be implemented later
    navigation.navigate('SendMoney');
  };

  const handleRequestMoney = () => {
    // Will be implemented later
    navigation.navigate('RequestMoney');
  };

  const handleScanQR = () => {
    // Will be implemented later
    navigation.navigate('ScanQR');
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'User'}</Text>
            <Text style={styles.welcomeText}>Welcome to Benkinet</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Wallets Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Wallets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {wallets.length > 0 ? (
              wallets.map((wallet, index) => (
                <TouchableOpacity
                  key={wallet.id || index}
                  style={styles.walletCard}
                  onPress={() => navigation.navigate('WalletDetails', { walletId: wallet.id })}
                >
                  <Text style={styles.walletName}>{wallet.name || 'Wallet'}</Text>
                  <Text style={styles.walletBalance}>
                    {formatCurrency(wallet.balance || 0, wallet.currency || 'USD')}
                  </Text>
                  <Text style={styles.walletCurrency}>{wallet.currency || 'USD'}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyWalletCard}>
                <Text style={styles.emptyStateText}>No wallets found</Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => navigation.navigate('CreateWallet')}
                >
                  <Text style={styles.createButtonText}>Create Wallet</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSendMoney}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <Text style={styles.actionIconText}>↑</Text>
              </View>
              <Text style={styles.actionText}>Send Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleRequestMoney}>
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
                <Text style={styles.actionIconText}>↓</Text>
              </View>
              <Text style={styles.actionText}>Request Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleScanQR}>
              <View style={[styles.actionIcon, { backgroundColor: colors.info }]}>
                <Text style={styles.actionIconText}>⊡</Text>
              </View>
              <Text style={styles.actionText}>Scan QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <TouchableOpacity
                key={transaction.id || index}
                style={styles.transactionItem}
                onPress={() =>
                  navigation.navigate('TransactionDetails', { transactionId: transaction.id })
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
                  {formatCurrency(transaction.amount || 0, transaction.currency || 'USD')}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No recent transactions</Text>
            </View>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.dark,
  },
  welcomeText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  logoutButton: {
    padding: spacing.sm,
  },
  logoutText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
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
  walletCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    width: 150,
    ...shadows.md,
  },
  walletName: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  walletBalance: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  walletCurrency: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  emptyWalletCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  createButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  actionIconText: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
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
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[500],
    textAlign: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});

export default HomeScreen;
