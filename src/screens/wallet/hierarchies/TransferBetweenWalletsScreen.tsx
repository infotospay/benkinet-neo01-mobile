import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store';
import { colors, spacing, typography, borderRadius, shadows } from '../../../theme';
import { apiService } from '../../../api';
import { fetchWalletHierarchies } from '../../../store/slices/walletSlice';

const TransferBetweenWalletsScreen = ({ route, navigation }: any) => {
  const { hierarchyId } = route.params;
  const dispatch = useAppDispatch();
  const { hierarchies } = useAppSelector((state) => state.wallet);
  
  const [hierarchy, setHierarchy] = useState<any>(null);
  const [sourceWallet, setSourceWallet] = useState<any>(null);
  const [destinationWallet, setDestinationWallet] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSourceWalletModal, setShowSourceWalletModal] = useState(false);
  const [showDestinationWalletModal, setShowDestinationWalletModal] = useState(false);
  const [transferFee, setTransferFee] = useState<number | null>(null);
  const [isFeeLoading, setIsFeeLoading] = useState(false);

  useEffect(() => {
    loadHierarchyDetails();
  }, [hierarchyId]);

  useEffect(() => {
    if (sourceWallet && destinationWallet && amount) {
      calculateTransferFee();
    } else {
      setTransferFee(null);
    }
  }, [sourceWallet, destinationWallet, amount]);

  const loadHierarchyDetails = async () => {
    try {
      setIsFetching(true);
      setError(null);
      
      // First, check if we already have the hierarchy in the Redux store
      const existingHierarchy = hierarchies.find((h) => h.id === hierarchyId);
      if (existingHierarchy) {
        setHierarchy(existingHierarchy);
      }
      
      // Fetch detailed hierarchy information
      const response = await apiService.getHierarchyDetails(hierarchyId);
      setHierarchy(response.data);
    } catch (error: any) {
      console.error('Error loading hierarchy details:', error);
      setError(error.message || 'Failed to load hierarchy details');
    } finally {
      setIsFetching(false);
    }
  };

  const calculateTransferFee = async () => {
    if (!sourceWallet || !destinationWallet || !amount || isNaN(parseFloat(amount))) {
      return;
    }

    try {
      setIsFeeLoading(true);
      
      const feeData = {
        sourceWalletId: sourceWallet.id,
        destinationWalletId: destinationWallet.id,
        amount: parseFloat(amount),
        type: 'INTERNAL_TRANSFER',
      };
      
      const response = await apiService.calculateTransactionFee(feeData);
      setTransferFee(response.data.fee);
    } catch (error: any) {
      console.error('Error calculating transfer fee:', error);
      // Don't show error to user, just set fee to null
      setTransferFee(null);
    } finally {
      setIsFeeLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!sourceWallet) {
      Alert.alert('Error', 'Please select a source wallet');
      return;
    }
    
    if (!destinationWallet) {
      Alert.alert('Error', 'Please select a destination wallet');
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (sourceWallet.id === destinationWallet.id) {
      Alert.alert('Error', 'Source and destination wallets cannot be the same');
      return;
    }
    
    if (parseFloat(amount) > sourceWallet.balance) {
      Alert.alert('Error', 'Insufficient balance in source wallet');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const transferData = {
        sourceWalletId: sourceWallet.id,
        destinationWalletId: destinationWallet.id,
        amount: parseFloat(amount),
        description: description.trim() || 'Wallet to wallet transfer',
        type: 'INTERNAL_TRANSFER',
      };
      
      await apiService.createTransaction(transferData);
      
      // Refresh hierarchies list to update balances
      await dispatch(fetchWalletHierarchies()).unwrap();
      
      Alert.alert(
        'Success',
        'Transfer completed successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Error transferring between wallets:', error);
      setError(error.message || 'Failed to complete transfer');
    } finally {
      setIsLoading(false);
    }
  };

  const renderWalletItem = ({ item }: { item: any }, onSelect: (wallet: any) => void) => (
    <TouchableOpacity
      style={styles.walletItem}
      onPress={() => onSelect(item)}
    >
      <View style={styles.walletInfo}>
        <Text style={styles.walletName}>{item.name}</Text>
        <Text style={styles.walletCurrency}>{item.currency}</Text>
      </View>
      <Text style={styles.walletBalance}>
        {item.balance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>
    </TouchableOpacity>
  );

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading hierarchy details...</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Transfer Between Wallets</Text>
        <Text style={styles.subtitle}>
          Move funds between wallets in the {hierarchy.name} hierarchy
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>From Wallet</Text>
            <TouchableOpacity
              style={styles.walletSelector}
              onPress={() => setShowSourceWalletModal(true)}
            >
              {sourceWallet ? (
                <View style={styles.selectedWallet}>
                  <View>
                    <Text style={styles.selectedWalletName}>{sourceWallet.name}</Text>
                    <Text style={styles.selectedWalletCurrency}>{sourceWallet.currency}</Text>
                  </View>
                  <Text style={styles.selectedWalletBalance}>
                    {sourceWallet.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              ) : (
                <Text style={styles.walletSelectorPlaceholder}>Select source wallet</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>To Wallet</Text>
            <TouchableOpacity
              style={styles.walletSelector}
              onPress={() => setShowDestinationWalletModal(true)}
            >
              {destinationWallet ? (
                <View style={styles.selectedWallet}>
                  <View>
                    <Text style={styles.selectedWalletName}>{destinationWallet.name}</Text>
                    <Text style={styles.selectedWalletCurrency}>{destinationWallet.currency}</Text>
                  </View>
                  <Text style={styles.selectedWalletBalance}>
                    {destinationWallet.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              ) : (
                <Text style={styles.walletSelectorPlaceholder}>Select destination wallet</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              placeholderTextColor={colors.gray[400]}
              keyboardType="numeric"
            />
          </View>

          {isFeeLoading ? (
            <View style={styles.feeContainer}>
              <Text style={styles.feeLabel}>Calculating fee...</Text>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : transferFee !== null ? (
            <View style={styles.feeContainer}>
              <Text style={styles.feeLabel}>Transfer Fee:</Text>
              <Text style={styles.feeValue}>
                {transferFee.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter transfer description"
              placeholderTextColor={colors.gray[400]}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.transferButton}
          onPress={handleTransfer}
          disabled={isLoading}
        >
          <Text style={styles.transferButtonText}>Complete Transfer</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Source Wallet Selection Modal */}
      <Modal
        visible={showSourceWalletModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSourceWalletModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Source Wallet</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowSourceWalletModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={hierarchy.wallets}
              renderItem={(props) => renderWalletItem(props, (wallet) => {
                setSourceWallet(wallet);
                setShowSourceWalletModal(false);
              })}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.modalList}
            />
          </View>
        </View>
      </Modal>

      {/* Destination Wallet Selection Modal */}
      <Modal
        visible={showDestinationWalletModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDestinationWalletModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Destination Wallet</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowDestinationWalletModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={hierarchy.wallets}
              renderItem={(props) => renderWalletItem(props, (wallet) => {
                setDestinationWallet(wallet);
                setShowDestinationWalletModal(false);
              })}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.modalList}
            />
          </View>
        </View>
      </Modal>

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
    padding: spacing.lg,
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
    marginBottom: spacing.xl,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  textArea: {
    minHeight: 80,
  },
  walletSelector: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  walletSelectorPlaceholder: {
    color: colors.gray[400],
    fontSize: typography.fontSize.md,
  },
  selectedWallet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedWalletName: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
  },
  selectedWalletCurrency: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  selectedWalletBalance: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  feeLabel: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  feeValue: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  transferButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  transferButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
  },
  modalCloseButton: {
    padding: spacing.sm,
  },
  modalCloseButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  modalList: {
    padding: spacing.md,
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
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
  walletCurrency: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  walletBalance: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default TransferBetweenWalletsScreen;
