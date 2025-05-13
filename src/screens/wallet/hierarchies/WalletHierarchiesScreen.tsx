import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchWalletHierarchies } from '../../../store/slices/walletSlice';
import { colors, spacing, typography, borderRadius, shadows } from '../../../theme';

const WalletHierarchiesScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { hierarchies, isLoading, error } = useAppSelector((state) => state.wallet);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedHierarchies, setExpandedHierarchies] = useState<string[]>([]);

  useEffect(() => {
    loadHierarchies();
  }, []);

  const loadHierarchies = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchWalletHierarchies()).unwrap();
    } catch (error) {
      console.error('Error loading wallet hierarchies:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleHierarchyExpansion = (hierarchyId: string) => {
    setExpandedHierarchies((prev) => {
      if (prev.includes(hierarchyId)) {
        return prev.filter((id) => id !== hierarchyId);
      } else {
        return [...prev, hierarchyId];
      }
    });
  };

  const handleWalletPress = (walletId: string) => {
    navigation.navigate('WalletDetails', { walletId });
  };

  const handleHierarchyPress = (hierarchyId: string) => {
    navigation.navigate('HierarchyDetails', { hierarchyId });
  };

  const renderWalletItem = ({ item }: { item: any }) => {
    const totalBalance = item.wallets.reduce(
      (sum: number, wallet: any) => sum + wallet.balance,
      0
    );

    return (
      <TouchableOpacity
        style={styles.hierarchyItem}
        onPress={() => toggleHierarchyExpansion(item.id)}
      >
        <View style={styles.hierarchyHeader}>
          <View>
            <Text style={styles.hierarchyName}>{item.name}</Text>
            <Text style={styles.hierarchyDescription}>{item.description || 'No description'}</Text>
          </View>
          <View style={styles.hierarchyBalance}>
            <Text style={styles.hierarchyBalanceValue}>
              {totalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.hierarchyBalanceLabel}>Total Balance</Text>
          </View>
        </View>

        {expandedHierarchies.includes(item.id) && (
          <View style={styles.walletsContainer}>
            <Text style={styles.walletsTitle}>Wallets</Text>
            {item.wallets.map((wallet: any) => (
              <TouchableOpacity
                key={wallet.id}
                style={styles.walletItem}
                onPress={() => handleWalletPress(wallet.id)}
              >
                <View style={styles.walletInfo}>
                  <Text style={styles.walletName}>{wallet.name}</Text>
                  <Text style={styles.walletCurrency}>{wallet.currency}</Text>
                </View>
                <View style={styles.walletBalance}>
                  <Text style={styles.walletBalanceValue}>
                    {wallet.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => handleHierarchyPress(item.id)}
            >
              <Text style={styles.viewDetailsButtonText}>View Hierarchy Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Wallet Hierarchies</Text>
      <Text style={styles.emptyText}>
        You don't have any wallet hierarchies yet. Create a hierarchy to organize your wallets.
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateHierarchy')}
      >
        <Text style={styles.createButtonText}>Create Hierarchy</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet Hierarchies</Text>
        <TouchableOpacity
          style={styles.createHierarchyButton}
          onPress={() => navigation.navigate('CreateHierarchy')}
        >
          <Text style={styles.createHierarchyButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={hierarchies}
        renderItem={renderWalletItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadHierarchies} />
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
  createHierarchyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  createHierarchyButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: typography.fontSize.sm,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  hierarchyItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  hierarchyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: expandedHierarchies.length > 0 ? 1 : 0,
    borderBottomColor: colors.gray[200],
  },
  hierarchyName: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  hierarchyDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  hierarchyBalance: {
    alignItems: 'flex-end',
  },
  hierarchyBalanceValue: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  hierarchyBalanceLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
  walletsContainer: {
    padding: spacing.md,
    backgroundColor: colors.light,
  },
  walletsTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
    ...shadows.xs,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.dark,
  },
  walletCurrency: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
  walletBalance: {
    alignItems: 'flex-end',
  },
  walletBalanceValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
    color: colors.primary,
  },
  viewDetailsButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    ...shadows.xs,
  },
  viewDetailsButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
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

export default WalletHierarchiesScreen;
