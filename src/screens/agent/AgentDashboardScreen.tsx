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
import { UserRole } from '../../store/slices/roleSlice';

const AgentDashboardScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { activeRole } = useAppSelector((state) => state.role);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [agentData, setAgentData] = useState<any>(null);
  const [floatAccounts, setFloatAccounts] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  
  useEffect(() => {
    loadAgentData();
  }, [activeRole]);
  
  const loadAgentData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch this data from the API
      // For now, we'll use mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setAgentData({
        id: '123456',
        name: 'Agent Name',
        status: 'ACTIVE',
        totalBalance: 5000,
        currency: 'KES',
        todayTransactions: 12,
        pendingRequests: 3,
      });
      
      setFloatAccounts([
        { id: '1', currency: 'KES', balance: 3500 },
        { id: '2', currency: 'UGX', balance: 1500000 },
        { id: '3', currency: 'TZS', balance: 250000 },
      ]);
      
      setRecentTransactions([
        { id: '1', type: 'CASH_IN', amount: 1000, currency: 'KES', customerName: 'John Doe', timestamp: new Date().toISOString(), status: 'COMPLETED' },
        { id: '2', type: 'CASH_OUT', amount: 500, currency: 'KES', customerName: 'Jane Smith', timestamp: new Date().toISOString(), status: 'COMPLETED' },
        { id: '3', type: 'FLOAT_REQUEST', amount: 2000, currency: 'KES', customerName: 'Super Agent', timestamp: new Date().toISOString(), status: 'PENDING' },
      ]);
      
    } catch (error) {
      console.error('Error loading agent data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setIsRefreshing(true);
    loadAgentData();
  };
  
  const handleCashIn = () => {
    navigation.navigate('CashIn');
  };
  
  const handleCashOut = () => {
    navigation.navigate('CashOut');
  };
  
  const handleFloatRequest = () => {
    navigation.navigate('FloatRequest');
  };
  
  const handleViewTransactions = () => {
    navigation.navigate('AgentTransactions');
  };
  
  const handleViewFloatAccounts = () => {
    navigation.navigate('FloatAccounts');
  };
  
  const handleViewCommissions = () => {
    navigation.navigate('AgentCommissions');
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading agent dashboard...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agent Dashboard</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Float Balance</Text>
          <Text style={styles.balanceAmount}>
            {agentData.currency} {agentData.totalBalance.toLocaleString()}
          </Text>
          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatValue}>{agentData.todayTransactions}</Text>
              <Text style={styles.balanceStatLabel}>Today's Transactions</Text>
            </View>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatValue}>{agentData.pendingRequests}</Text>
              <Text style={styles.balanceStatLabel}>Pending Requests</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCashIn}>
            <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
              <Text style={styles.actionIconText}>↓</Text>
            </View>
            <Text style={styles.actionText}>Cash In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleCashOut}>
            <View style={[styles.actionIcon, { backgroundColor: colors.warning + '20' }]}>
              <Text style={styles.actionIconText}>↑</Text>
            </View>
            <Text style={styles.actionText}>Cash Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleFloatRequest}>
            <View style={[styles.actionIcon, { backgroundColor: colors.info + '20' }]}>
              <Text style={styles.actionIconText}>+</Text>
            </View>
            <Text style={styles.actionText}>Request Float</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Float Accounts</Text>
            <TouchableOpacity onPress={handleViewFloatAccounts}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {floatAccounts.map((account) => (
            <View key={account.id} style={styles.floatAccountItem}>
              <Text style={styles.floatAccountCurrency}>{account.currency}</Text>
              <Text style={styles.floatAccountBalance}>
                {account.balance.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={handleViewTransactions}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIconContainer}>
                <Text style={styles.transactionIcon}>
                  {transaction.type === 'CASH_IN' ? '↓' : 
                   transaction.type === 'CASH_OUT' ? '↑' : '+'}
                </Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>
                  {transaction.type === 'CASH_IN' ? 'Cash In' : 
                   transaction.type === 'CASH_OUT' ? 'Cash Out' : 'Float Request'}
                </Text>
                <Text style={styles.transactionCustomer}>{transaction.customerName}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.transactionAmountText,
                  transaction.type === 'CASH_IN' ? styles.cashInAmount : 
                  transaction.type === 'CASH_OUT' ? styles.cashOutAmount : styles.floatAmount
                ]}>
                  {transaction.type === 'CASH_IN' ? '+' : 
                   transaction.type === 'CASH_OUT' ? '-' : '+'} {transaction.currency} {transaction.amount}
                </Text>
                <Text style={[
                  styles.transactionStatus,
                  transaction.status === 'COMPLETED' ? styles.completedStatus : styles.pendingStatus
                ]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.commissionButton}
          onPress={handleViewCommissions}
        >
          <Text style={styles.commissionButtonText}>View Commissions</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.light,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.dark,
  },
  scrollView: {
    padding: spacing.lg,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  balanceLabel: {
    fontSize: typography.fontSize.md,
    color: colors.white,
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.white,
    marginVertical: spacing.sm,
  },
  balanceStats: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  balanceStat: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.white + '30',
    paddingRight: spacing.sm,
    marginRight: spacing.sm,
  },
  balanceStatValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.white,
  },
  balanceStatLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    opacity: 0.8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionIconText: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.dark,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
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
  },
  sectionAction: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  floatAccountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  floatAccountCurrency: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
  },
  floatAccountBalance: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionIcon: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
  },
  transactionCustomer: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  cashInAmount: {
    color: colors.success,
  },
  cashOutAmount: {
    color: colors.warning,
  },
  floatAmount: {
    color: colors.info,
  },
  transactionStatus: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
  },
  completedStatus: {
    color: colors.success,
  },
  pendingStatus: {
    color: colors.warning,
  },
  commissionButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  commissionButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default AgentDashboardScreen;
