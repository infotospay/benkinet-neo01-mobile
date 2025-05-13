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
import { formatCurrency } from '../../utils';

const WalletScreen = ({ navigation }: any) => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch wallets
      const response = await apiService.getWallets();
      setWallets(response.data || []);
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
    loadWallets();
  };

  const handleCreateWallet = () => {
    navigation.navigate('CreateWallet');
  };

  const handleWalletPress = (walletId: string) => {
    navigation.navigate('WalletDetails', { walletId });
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your wallets...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallets</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateWallet}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {wallets.length > 0 ? (
          wallets.map((wallet, index) => (
            <TouchableOpacity
              key={wallet.id || index}
              style={styles.walletCard}
              onPress={() => handleWalletPress(wallet.id)}
            >
              <View style={styles.walletHeader}>
                <Text style={styles.walletName}>{wallet.name || 'Wallet'}</Text>
                <View
                  style={[
                    styles.walletStatus,
                    {
                      backgroundColor: wallet.isActive
                        ? colors.success
                        : colors.gray[400],
                    },
                  ]}
                />
              </View>
              <Text style={styles.walletBalance}>
                {formatCurrency(wallet.balance || 0, wallet.currency || 'USD')}
              </Text>
              <View style={styles.walletFooter}>
                <Text style={styles.walletCurrency}>{wallet.currency || 'USD'}</Text>
                <Text style={styles.walletType}>{wallet.type || 'Personal'}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No Wallets Found</Text>
            <Text style={styles.emptyStateText}>
              You don't have any wallets yet. Create your first wallet to get started.
            </Text>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateWallet}>
              <Text style={styles.createButtonText}>Create Wallet</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
  scrollView: {
    padding: spacing.lg,
  },
  walletCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
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
  emptyStateContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  createButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSize.sm,
    padding: spacing.md,
    textAlign: 'center',
    backgroundColor: colors.white,
  },
});

export default WalletScreen;
