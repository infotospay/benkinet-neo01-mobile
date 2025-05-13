import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store';
import { colors, spacing, typography, borderRadius, shadows } from '../../../theme';
import { apiService } from '../../../api';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HierarchyDetailsScreen = ({ route, navigation }: any) => {
  const { hierarchyId } = route.params;
  const dispatch = useAppDispatch();
  const { hierarchies } = useAppSelector((state) => state.wallet);
  
  const [hierarchy, setHierarchy] = useState<any>(null);
  const [balances, setBalances] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHierarchyDetails();
  }, [hierarchyId]);

  const loadHierarchyDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First, check if we already have the hierarchy in the Redux store
      const existingHierarchy = hierarchies.find((h) => h.id === hierarchyId);
      if (existingHierarchy) {
        setHierarchy(existingHierarchy);
      }
      
      // Fetch detailed hierarchy information
      const response = await apiService.getHierarchyDetails(hierarchyId);
      setHierarchy(response.data);
      
      // Fetch hierarchy balances
      const balancesResponse = await apiService.getHierarchyBalances(hierarchyId);
      setBalances(balancesResponse.data);
    } catch (error: any) {
      console.error('Error loading hierarchy details:', error);
      setError(error.message || 'Failed to load hierarchy details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditHierarchy = () => {
    navigation.navigate('EditHierarchy', { hierarchyId });
  };

  const handleAddWallet = () => {
    navigation.navigate('CreateWallet', { hierarchyId });
  };

  const handleWalletPress = (walletId: string) => {
    navigation.navigate('WalletDetails', { walletId });
  };

  const getChartData = () => {
    if (!hierarchy || !hierarchy.wallets || hierarchy.wallets.length === 0) {
      return [];
    }

    const chartColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC24A', '#607D8B', '#E91E63', '#3F51B5'
    ];

    return hierarchy.wallets.map((wallet: any, index: number) => ({
      name: wallet.name,
      balance: wallet.balance,
      currency: wallet.currency,
      color: chartColors[index % chartColors.length],
      legendFontColor: colors.dark,
      legendFontSize: 12,
    }));
  };

  if (isLoading && !hierarchy) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading hierarchy details...</Text>
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
          onPress={loadHierarchyDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hierarchy) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Hierarchy Not Found</Text>
        <Text style={styles.errorText}>The requested hierarchy could not be found.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalBalance = hierarchy.wallets.reduce(
    (sum: number, wallet: any) => sum + wallet.balance,
    0
  );

  const chartData = getChartData();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.hierarchyName}>{hierarchy.name}</Text>
            <Text style={styles.hierarchyDescription}>
              {hierarchy.description || 'No description'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditHierarchy}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>
            {totalBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        {chartData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Balance Distribution</Text>
            <PieChart
              data={chartData}
              width={screenWidth - spacing.lg * 2}
              height={220}
              chartConfig={{
                backgroundColor: colors.white,
                backgroundGradientFrom: colors.white,
                backgroundGradientTo: colors.white,
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="balance"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        <View style={styles.walletsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wallets</Text>
            <TouchableOpacity
              style={styles.addWalletButton}
              onPress={handleAddWallet}
            >
              <Text style={styles.addWalletButtonText}>Add Wallet</Text>
            </TouchableOpacity>
          </View>

          {hierarchy.wallets.length === 0 ? (
            <View style={styles.emptyWalletsContainer}>
              <Text style={styles.emptyWalletsText}>
                No wallets in this hierarchy yet. Add a wallet to get started.
              </Text>
            </View>
          ) : (
            hierarchy.wallets.map((wallet: any) => (
              <TouchableOpacity
                key={wallet.id}
                style={styles.walletItem}
                onPress={() => handleWalletPress(wallet.id)}
              >
                <View style={styles.walletInfo}>
                  <Text style={styles.walletName}>{wallet.name}</Text>
                  <Text style={styles.walletType}>{wallet.type}</Text>
                </View>
                <View style={styles.walletBalance}>
                  <Text style={styles.walletBalanceValue}>
                    {wallet.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                  <Text style={styles.walletCurrency}>{wallet.currency}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {balances && (
          <View style={styles.currencySection}>
            <Text style={styles.sectionTitle}>Currency Breakdown</Text>
            {Object.entries(balances.currencies).map(([currency, balance]: [string, any]) => (
              <View key={currency} style={styles.currencyItem}>
                <Text style={styles.currencyCode}>{currency}</Text>
                <Text style={styles.currencyBalance}>
                  {(balance as number).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryActionButton]}
            onPress={() => navigation.navigate('TransferBetweenWallets', { hierarchyId })}
          >
            <Text style={styles.primaryActionButtonText}>Transfer Between Wallets</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available in a future update.')}
          >
            <Text style={styles.secondaryActionButtonText}>Export Statement</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isLoading && (
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
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  hierarchyName: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  hierarchyDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: typography.fontSize.sm,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  balanceLabel: {
    fontSize: typography.fontSize.md,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
  balanceValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.white,
  },
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  walletsSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
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
  addWalletButton: {
    backgroundColor: colors.light,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addWalletButtonText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: typography.fontSize.sm,
  },
  emptyWalletsContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWalletsText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  walletType: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
  walletBalance: {
    alignItems: 'flex-end',
  },
  walletBalanceValue: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  walletCurrency: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
  currencySection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  currencyCode: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
  },
  currencyBalance: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionsSection: {
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HierarchyDetailsScreen;
