import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTransactions } from '../../store/slices/transactionSlice';
import { formatCurrency, formatDate } from '../../utils';

const TransactionsListScreen = ({ route, navigation }: any) => {
  const { walletId } = route.params || {};
  const dispatch = useAppDispatch();
  const { transactions, isLoading, error } = useAppSelector((state) => state.transaction);
  const { wallets } = useAppSelector((state) => state.wallet);
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState(walletId || 'all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  
  useEffect(() => {
    loadTransactions();
  }, []);
  
  useEffect(() => {
    filterTransactions();
  }, [transactions, selectedWalletId, selectedType, selectedStatus, searchQuery]);
  
  const loadTransactions = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchTransactions()).unwrap();
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by wallet
    if (selectedWalletId !== 'all') {
      filtered = filtered.filter(
        (transaction) =>
          transaction.sourceWalletId === selectedWalletId ||
          transaction.destinationWalletId === selectedWalletId
      );
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === selectedType);
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((transaction) => transaction.status === selectedStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.description?.toLowerCase().includes(query) ||
          transaction.id.toLowerCase().includes(query) ||
          (transaction.recipientInfo?.name &&
            transaction.recipientInfo.name.toLowerCase().includes(query))
      );
    }
    
    setFilteredTransactions(filtered);
  };
  
  const onRefresh = useCallback(() => {
    loadTransactions();
  }, []);
  
  const renderWalletFilter = () => {
    const options = [
      { id: 'all', name: 'All Wallets' },
      ...wallets.map((wallet) => ({ id: wallet.id, name: wallet.name })),
    ];
    
    return (
      <ScrollableFilter
        title="Wallet"
        options={options}
        selectedId={selectedWalletId}
        onSelect={setSelectedWalletId}
      />
    );
  };
  
  const renderTypeFilter = () => {
    const options = [
      { id: 'all', name: 'All Types' },
      { id: 'CREDIT', name: 'Credit' },
      { id: 'DEBIT', name: 'Debit' },
    ];
    
    return (
      <ScrollableFilter
        title="Type"
        options={options}
        selectedId={selectedType}
        onSelect={setSelectedType}
      />
    );
  };
  
  const renderStatusFilter = () => {
    const options = [
      { id: 'all', name: 'All Statuses' },
      { id: 'COMPLETED', name: 'Completed' },
      { id: 'PENDING', name: 'Pending' },
      { id: 'FAILED', name: 'Failed' },
    ];
    
    return (
      <ScrollableFilter
        title="Status"
        options={options}
        selectedId={selectedStatus}
        onSelect={setSelectedStatus}
      />
    );
  };
  
  const renderTransactionItem = ({ item }: { item: any }) => {
    const isCredit = item.type === 'CREDIT';
    const statusColor =
      item.status === 'COMPLETED'
        ? colors.success
        : item.status === 'PENDING'
        ? colors.warning
        : colors.danger;
    
    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => navigation.navigate('TransactionDetails', { transactionId: item.id })}
      >
        <View style={styles.transactionIconContainer}>
          <Text style={styles.transactionIcon}>{isCredit ? '↓' : '↑'}</Text>
        </View>
        
        <View style={styles.transactionContent}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionTitle} numberOfLines={1}>
              {item.description || 'Transaction'}
            </Text>
            <Text
              style={[
                styles.transactionAmount,
                { color: isCredit ? colors.success : colors.danger },
              ]}
            >
              {isCredit ? '+' : '-'}
              {formatCurrency(item.amount, item.currency)}
            </Text>
          </View>
          
          <View style={styles.transactionFooter}>
            <Text style={styles.transactionDate}>
              {formatDate(item.createdAt, 'short')}
            </Text>
            <View
              style={[styles.statusBadge, { backgroundColor: statusColor }]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Transactions Found</Text>
      <Text style={styles.emptyText}>
        {searchQuery || selectedWalletId !== 'all' || selectedType !== 'all' || selectedStatus !== 'all'
          ? 'Try changing your filters or search query'
          : 'Your transactions will appear here'}
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor={colors.gray[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        {renderWalletFilter()}
        {renderTypeFilter()}
        {renderStatusFilter()}
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyList}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Transactions</Text>
            <Text style={styles.listSubtitle}>
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const ScrollableFilter = ({
  title,
  options,
  selectedId,
  onSelect,
}: {
  title: string;
  options: { id: string; name: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterOptionsContainer}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterOption,
              selectedId === option.id && styles.selectedFilterOption,
            ]}
            onPress={() => onSelect(option.id)}
          >
            <Text
              style={[
                styles.filterOptionText,
                selectedId === option.id && styles.selectedFilterOptionText,
              ]}
            >
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  searchInput: {
    height: 40,
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  filtersContainer: {
    backgroundColor: colors.white,
    paddingBottom: spacing.md,
    ...shadows.sm,
  },
  filterSection: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  filterTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  filterOptionsContainer: {
    paddingVertical: spacing.xs,
  },
  filterOption: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  selectedFilterOption: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  selectedFilterOptionText: {
    color: colors.white,
    fontWeight: '500',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  listHeader: {
    marginBottom: spacing.md,
  },
  listTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
  },
  listSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionIcon: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[700],
  },
  transactionContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  transactionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    flex: 1,
    marginRight: spacing.sm,
  },
  transactionAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.round,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
    color: colors.white,
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
});

export default TransactionsListScreen;
