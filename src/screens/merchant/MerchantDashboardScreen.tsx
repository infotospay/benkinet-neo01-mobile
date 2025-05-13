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

const MerchantDashboardScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { activeRole } = useAppSelector((state) => state.role);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [merchantData, setMerchantData] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  
  useEffect(() => {
    loadMerchantData();
  }, [activeRole]);
  
  const loadMerchantData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch this data from the API
      // For now, we'll use mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setMerchantData({
        id: '123456',
        name: 'Merchant Store',
        status: 'ACTIVE',
        totalSales: 15000,
        currency: 'KES',
        todayTransactions: 8,
        pendingSettlements: 2,
        hasDualRole: true,
      });
      
      setRecentTransactions([
        { id: '1', type: 'PAYMENT', amount: 1200, currency: 'KES', customerName: 'John Doe', timestamp: new Date().toISOString(), status: 'COMPLETED', method: 'MOBILE_MONEY' },
        { id: '2', type: 'REFUND', amount: 500, currency: 'KES', customerName: 'Jane Smith', timestamp: new Date().toISOString(), status: 'COMPLETED', method: 'CARD' },
        { id: '3', type: 'PAYMENT', amount: 3000, currency: 'KES', customerName: 'Bob Johnson', timestamp: new Date().toISOString(), status: 'PENDING', method: 'QR_CODE' },
      ]);
      
      setPaymentMethods([
        { id: '1', type: 'MOBILE_MONEY', name: 'Mobile Money', isActive: true },
        { id: '2', type: 'CARD', name: 'Card Payments', isActive: true },
        { id: '3', type: 'QR_CODE', name: 'QR Code', isActive: true },
        { id: '4', type: 'PAYMENT_LINK', name: 'Payment Links', isActive: true },
      ]);
      
    } catch (error) {
      console.error('Error loading merchant data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setIsRefreshing(true);
    loadMerchantData();
  };
  
  const handleCreatePaymentLink = () => {
    navigation.navigate('CreatePaymentLink');
  };
  
  const handleGenerateQR = () => {
    navigation.navigate('GenerateQR');
  };
  
  const handleViewTransactions = () => {
    navigation.navigate('MerchantTransactions');
  };
  
  const handleViewSettlements = () => {
    navigation.navigate('MerchantSettlements');
  };
  
  const handleViewCommissions = () => {
    navigation.navigate('MerchantCommissions');
  };
  
  const handleViewDualRole = () => {
    navigation.navigate('MerchantDualRole');
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading merchant dashboard...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Merchant Dashboard</Text>
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
        <View style={styles.salesCard}>
          <Text style={styles.salesLabel}>Total Sales</Text>
          <Text style={styles.salesAmount}>
            {merchantData.currency} {merchantData.totalSales.toLocaleString()}
          </Text>
          <View style={styles.salesStats}>
            <View style={styles.salesStat}>
              <Text style={styles.salesStatValue}>{merchantData.todayTransactions}</Text>
              <Text style={styles.salesStatLabel}>Today's Transactions</Text>
            </View>
            <View style={styles.salesStat}>
              <Text style={styles.salesStatValue}>{merchantData.pendingSettlements}</Text>
              <Text style={styles.salesStatLabel}>Pending Settlements</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCreatePaymentLink}>
            <View style={[styles.actionIcon, { backgroundColor: colors.info + '20' }]}>
              <Text style={styles.actionIconText}>🔗</Text>
            </View>
            <Text style={styles.actionText}>Payment Link</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleGenerateQR}>
            <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
              <Text style={styles.actionIconText}>📱</Text>
            </View>
            <Text style={styles.actionText}>QR Code</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
          </View>
          
          <View style={styles.paymentMethodsGrid}>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentMethodItem}>
                <View style={[
                  styles.paymentMethodIcon,
                  { backgroundColor: method.isActive ? colors.primary + '20' : colors.gray[200] }
                ]}>
                  <Text style={styles.paymentMethodIconText}>
                    {method.type === 'MOBILE_MONEY' ? '📱' : 
                     method.type === 'CARD' ? '💳' : 
                     method.type === 'QR_CODE' ? '📲' : '🔗'}
                  </Text>
                </View>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
                <View style={[
                  styles.paymentMethodStatus,
                  { backgroundColor: method.isActive ? colors.success + '20' : colors.gray[200] }
                ]}>
                  <Text style={[
                    styles.paymentMethodStatusText,
                    { color: method.isActive ? colors.success : colors.gray[600] }
                  ]}>
                    {method.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
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
                  {transaction.type === 'PAYMENT' ? '💰' : '↩️'}
                </Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>
                  {transaction.type === 'PAYMENT' ? 'Payment' : 'Refund'}
                </Text>
                <Text style={styles.transactionCustomer}>{transaction.customerName}</Text>
                <Text style={styles.transactionMethod}>
                  {transaction.method === 'MOBILE_MONEY' ? 'Mobile Money' : 
                   transaction.method === 'CARD' ? 'Card' : 
                   transaction.method === 'QR_CODE' ? 'QR Code' : 'Payment Link'}
                </Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.transactionAmountText,
                  transaction.type === 'PAYMENT' ? styles.paymentAmount : styles.refundAmount
                ]}>
                  {transaction.type === 'PAYMENT' ? '+' : '-'} {transaction.currency} {transaction.amount}
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
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.actionButtonFull}
            onPress={handleViewSettlements}
          >
            <Text style={styles.actionButtonFullText}>View Settlements</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButtonFull}
            onPress={handleViewCommissions}
          >
            <Text style={styles.actionButtonFullText}>View Commissions</Text>
          </TouchableOpacity>
          
          {merchantData.hasDualRole && (
            <TouchableOpacity 
              style={[styles.actionButtonFull, styles.dualRoleButton]}
              onPress={handleViewDualRole}
            >
              <Text style={styles.dualRoleButtonText}>Dual Role Dashboard</Text>
            </TouchableOpacity>
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
  salesCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  salesLabel: {
    fontSize: typography.fontSize.md,
    color: colors.white,
    opacity: 0.8,
  },
  salesAmount: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.white,
    marginVertical: spacing.sm,
  },
  salesStats: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  salesStat: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.white + '30',
    paddingRight: spacing.sm,
    marginRight: spacing.sm,
  },
  salesStatValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.white,
  },
  salesStatLabel: {
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
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentMethodItem: {
    width: '48%',
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  paymentMethodIconText: {
    fontSize: typography.fontSize.lg,
  },
  paymentMethodName: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  paymentMethodStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  paymentMethodStatusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
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
  transactionMethod: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  paymentAmount: {
    color: colors.success,
  },
  refundAmount: {
    color: colors.warning,
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
  buttonGroup: {
    marginBottom: spacing.xl,
  },
  actionButtonFull: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  actionButtonFullText: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.primary,
  },
  dualRoleButton: {
    backgroundColor: colors.primary,
  },
  dualRoleButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.white,
  },
});

export default MerchantDashboardScreen;
