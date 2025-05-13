import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchWallets } from '../../store/slices/walletSlice';
import { formatCurrency } from '../../utils';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

const WithdrawToBankScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { wallets, isLoading: walletsLoading } = useAppSelector((state) => state.wallet);
  
  const [amount, setAmount] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkedBanks, setLinkedBanks] = useState<any[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [fee, setFee] = useState<number | null>(null);
  const [calculatingFee, setCalculatingFee] = useState(false);
  
  useEffect(() => {
    if (wallets.length === 0) {
      dispatch(fetchWallets());
    } else if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
      setSelectedWallet(wallets[0]);
    }
    
    loadLinkedBanks();
  }, [wallets]);
  
  useEffect(() => {
    if (selectedWalletId) {
      const wallet = wallets.find((w) => w.id === selectedWalletId);
      setSelectedWallet(wallet);
    }
  }, [selectedWalletId]);
  
  useEffect(() => {
    if (linkedBanks.length > 0 && !selectedBankId) {
      setSelectedBankId(linkedBanks[0].id);
      setSelectedBank(linkedBanks[0]);
    }
  }, [linkedBanks]);
  
  useEffect(() => {
    if (selectedBankId) {
      const bank = linkedBanks.find((b) => b.id === selectedBankId);
      setSelectedBank(bank);
    }
  }, [selectedBankId]);
  
  useEffect(() => {
    if (amount && selectedWallet) {
      calculateFee();
    }
  }, [amount, selectedWallet]);
  
  const loadLinkedBanks = async () => {
    try {
      setLoadingBanks(true);
      
      // In a real implementation, you would call the API to get linked banks
      // For this demo, we'll simulate a response
      // const response = await apiService.getLinkedBanks();
      
      // Simulate API response
      setTimeout(() => {
        const simulatedBanks = [
          {
            id: 'bank1',
            name: 'Chase Bank',
            accountNumber: '****1234',
            accountType: 'Checking',
            status: 'Active',
          },
          {
            id: 'bank2',
            name: 'Bank of America',
            accountNumber: '****5678',
            accountType: 'Savings',
            status: 'Active',
          },
        ];
        
        setLinkedBanks(simulatedBanks);
        setLoadingBanks(false);
      }, 1000);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setError(errorResponse.message);
      setLoadingBanks(false);
    }
  };
  
  const calculateFee = async () => {
    if (!amount || !selectedWallet) return;
    
    try {
      setCalculatingFee(true);
      
      // In a real implementation, you would call the API to calculate the fee
      // For this demo, we'll simulate a response
      // const response = await apiService.calculateWithdrawalFee({
      //   amount: parseFloat(amount),
      //   currency: selectedWallet.currency,
      // });
      
      // Simulate API response
      setTimeout(() => {
        // Simulate a 1% fee
        const amountValue = parseFloat(amount);
        const feeValue = Math.max(1, amountValue * 0.01); // Minimum fee of $1
        setFee(feeValue);
        setCalculatingFee(false);
      }, 500);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      console.error('Error calculating fee:', errorResponse.message);
      setFee(null);
      setCalculatingFee(false);
    }
  };
  
  const handleWithdraw = async () => {
    // Reset error
    setError(null);
    
    // Validate inputs
    if (!amount.trim()) {
      setError('Please enter an amount');
      return;
    }
    
    if (!selectedWalletId) {
      setError('Please select a wallet');
      return;
    }
    
    if (!selectedBankId) {
      setError('Please select a bank account');
      return;
    }
    
    // Check if amount is valid
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Check minimum withdrawal amount
    if (amountValue < 10) {
      setError('Minimum withdrawal amount is $10');
      return;
    }
    
    // Check if wallet has sufficient balance
    if (selectedWallet && amountValue > selectedWallet.balance) {
      setError('Insufficient balance');
      return;
    }
    
    // Calculate total amount with fee
    const totalAmount = amountValue + (fee || 0);
    if (selectedWallet && totalAmount > selectedWallet.balance) {
      setError('Insufficient balance to cover amount plus fee');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const withdrawalData = {
        amount: amountValue,
        walletId: selectedWalletId,
        bankId: selectedBankId,
        currency: selectedWallet?.currency || 'USD',
        fee: fee || 0,
      };
      
      // In a real implementation, you would call the API to initiate the withdrawal
      // For this demo, we'll simulate a response
      // const response = await apiService.initiateWithdrawal(withdrawalData);
      
      // Simulate API response
      setTimeout(() => {
        setIsLoading(false);
        
        Alert.alert(
          'Withdrawal Initiated',
          `Your withdrawal of ${formatCurrency(amountValue, selectedWallet?.currency || 'USD')} has been initiated. It may take 1-3 business days to process.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('BankTransfer'),
            },
          ]
        );
      }, 1500);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setError(errorResponse.message);
      setIsLoading(false);
    }
  };
  
  const renderWalletOption = (wallet: any) => {
    const isSelected = selectedWalletId === wallet.id;
    return (
      <TouchableOpacity
        key={wallet.id}
        style={[
          styles.optionCard,
          isSelected && styles.selectedOptionCard,
        ]}
        onPress={() => setSelectedWalletId(wallet.id)}
      >
        <View style={styles.optionContent}>
          <Text
            style={[
              styles.optionTitle,
              isSelected && styles.selectedOptionText,
            ]}
          >
            {wallet.name}
          </Text>
          <Text
            style={[
              styles.optionSubtitle,
              isSelected && styles.selectedOptionText,
            ]}
          >
            {formatCurrency(wallet.balance, wallet.currency)}
          </Text>
        </View>
        <View
          style={[
            styles.optionRadio,
            isSelected && styles.selectedOptionRadio,
          ]}
        >
          {isSelected && <View style={styles.optionRadioInner} />}
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderBankOption = (bank: any) => {
    const isSelected = selectedBankId === bank.id;
    return (
      <TouchableOpacity
        key={bank.id}
        style={[
          styles.optionCard,
          isSelected && styles.selectedOptionCard,
        ]}
        onPress={() => setSelectedBankId(bank.id)}
      >
        <View style={styles.optionContent}>
          <Text
            style={[
              styles.optionTitle,
              isSelected && styles.selectedOptionText,
            ]}
          >
            {bank.name}
          </Text>
          <Text
            style={[
              styles.optionSubtitle,
              isSelected && styles.selectedOptionText,
            ]}
          >
            {bank.accountType} - {bank.accountNumber}
          </Text>
        </View>
        <View
          style={[
            styles.optionRadio,
            isSelected && styles.selectedOptionRadio,
          ]}
        >
          {isSelected && <View style={styles.optionRadioInner} />}
        </View>
      </TouchableOpacity>
    );
  };
  
  if (walletsLoading && wallets.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading wallet information...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Withdraw to Bank</Text>
          <Text style={styles.subtitle}>
            Transfer money from your wallet to your bank account
          </Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Select Wallet</Text>
            {wallets.length > 0 ? (
              wallets.map(renderWalletOption)
            ) : (
              <Text style={styles.noDataText}>No wallets available</Text>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Select Bank Account</Text>
            {loadingBanks ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : linkedBanks.length > 0 ? (
              linkedBanks.map(renderBankOption)
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No linked bank accounts</Text>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => navigation.navigate('LinkBankAccount')}
                >
                  <Text style={styles.linkButtonText}>Link a Bank Account</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Enter Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>
                {selectedWallet?.currency === 'USD' ? '$' : selectedWallet?.currency}
              </Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.gray[400]}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                editable={!isLoading}
              />
            </View>
            <Text style={styles.amountNote}>Minimum withdrawal: $10</Text>
            
            {fee !== null && (
              <View style={styles.feeContainer}>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Amount:</Text>
                  <Text style={styles.feeValue}>
                    {amount ? formatCurrency(parseFloat(amount), selectedWallet?.currency || 'USD') : '$0.00'}
                  </Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Fee:</Text>
                  <Text style={styles.feeValue}>
                    {calculatingFee ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      formatCurrency(fee, selectedWallet?.currency || 'USD')
                    )}
                  </Text>
                </View>
                <View style={styles.feeSeparator} />
                <View style={styles.feeRow}>
                  <Text style={styles.feeTotalLabel}>Total:</Text>
                  <Text style={styles.feeTotalValue}>
                    {amount && !calculatingFee
                      ? formatCurrency(parseFloat(amount) + fee, selectedWallet?.currency || 'USD')
                      : '$0.00'}
                  </Text>
                </View>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={[
              styles.withdrawButton,
              (isLoading || !selectedWalletId || !selectedBankId || !amount) &&
                styles.disabledButton,
            ]}
            onPress={handleWithdraw}
            disabled={isLoading || !selectedWalletId || !selectedBankId || !amount}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.withdrawButtonText}>Initiate Withdrawal</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Important Information</Text>
            <Text style={styles.infoText}>
              • Bank transfers may take 1-3 business days to process{'\n'}
              • Minimum withdrawal amount: $10{'\n'}
              • A fee of 1% applies to all withdrawals (minimum $1){'\n'}
              • Transfer fees may apply based on your bank
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  selectedOptionCard: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  optionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  selectedOptionText: {
    color: colors.primary,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOptionRadio: {
    borderColor: colors.primary,
  },
  optionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  noDataContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  noDataText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  linkButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  linkButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  currencySymbol: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    height: 60,
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.dark,
  },
  amountNote: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing.sm,
  },
  feeContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  feeLabel: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  feeValue: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  feeSeparator: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.sm,
  },
  feeTotalLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.dark,
  },
  feeTotalValue: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  withdrawButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  withdrawButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: colors.gray[400],
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
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  infoTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
    lineHeight: typography.lineHeight.md,
  },
});

export default WithdrawToBankScreen;
