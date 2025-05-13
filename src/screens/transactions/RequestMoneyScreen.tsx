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

const RequestMoneyScreen = ({ route, navigation }: any) => {
  const { walletId } = route.params || {};
  const dispatch = useAppDispatch();
  const { wallets } = useAppSelector((state) => state.wallet);
  
  const [amount, setAmount] = useState('');
  const [senderIdentifier, setSenderIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(walletId || '');
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (wallets.length === 0) {
      dispatch(fetchWallets());
    } else if (selectedWalletId) {
      const wallet = wallets.find((w) => w.id === selectedWalletId);
      setSelectedWallet(wallet);
    } else if (wallets.length > 0) {
      setSelectedWalletId(wallets[0].id);
      setSelectedWallet(wallets[0]);
    }
  }, [wallets, selectedWalletId]);
  
  const handleWalletChange = (id: string) => {
    setSelectedWalletId(id);
    const wallet = wallets.find((w) => w.id === id);
    setSelectedWallet(wallet);
  };
  
  const handleRequestMoney = async () => {
    // Reset error
    setError(null);
    
    // Validate inputs
    if (!amount.trim()) {
      setError('Please enter an amount');
      return;
    }
    
    if (!senderIdentifier.trim()) {
      setError('Please enter sender email or phone');
      return;
    }
    
    if (!selectedWalletId) {
      setError('Please select a wallet');
      return;
    }
    
    // Check if amount is valid
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const requestData = {
        amount: amountValue,
        currency: selectedWallet.currency,
        destinationWalletId: selectedWalletId,
        senderIdentifier: senderIdentifier,
        description: description || 'Money Request',
      };
      
      await apiService.createMoneyRequest(requestData);
      
      Alert.alert(
        'Success',
        'Money request sent successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setError(errorResponse.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderWalletOption = (wallet: any) => {
    const isSelected = selectedWalletId === wallet.id;
    return (
      <TouchableOpacity
        key={wallet.id}
        style={[
          styles.walletOption,
          isSelected && styles.selectedWalletOption,
        ]}
        onPress={() => handleWalletChange(wallet.id)}
      >
        <View style={styles.walletOptionContent}>
          <Text
            style={[
              styles.walletOptionName,
              isSelected && styles.selectedWalletOptionText,
            ]}
          >
            {wallet.name}
          </Text>
          <Text
            style={[
              styles.walletOptionBalance,
              isSelected && styles.selectedWalletOptionText,
            ]}
          >
            {formatCurrency(wallet.balance, wallet.currency)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Request Money</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.gray[400]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={!isLoading}
              />
              <Text style={styles.currencyText}>
                {selectedWallet?.currency || 'USD'}
              </Text>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>To Wallet</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.walletOptionsContainer}
            >
              {wallets.length > 0 ? (
                wallets.map(renderWalletOption)
              ) : (
                <View style={styles.noWalletsContainer}>
                  <Text style={styles.noWalletsText}>No wallets available</Text>
                </View>
              )}
            </ScrollView>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sender (Email or Phone)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter sender email or phone"
              placeholderTextColor={colors.gray[400]}
              value={senderIdentifier}
              onChangeText={setSenderIdentifier}
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter description"
              placeholderTextColor={colors.gray[400]}
              value={description}
              onChangeText={setDescription}
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              Note: The sender will receive a notification with your request details.
              They can accept or decline the request.
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleRequestMoney}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Request Money</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  amountInput: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
  },
  currencyText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    fontWeight: '500',
  },
  walletOptionsContainer: {
    paddingVertical: spacing.xs,
  },
  walletOption: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginRight: spacing.md,
    minWidth: 150,
  },
  selectedWalletOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  walletOptionContent: {
    alignItems: 'flex-start',
  },
  walletOptionName: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  walletOptionBalance: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  selectedWalletOptionText: {
    color: colors.white,
  },
  noWalletsContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  noWalletsText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  noteContainer: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  noteText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
    lineHeight: typography.lineHeight.md,
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  disabledButton: {
    backgroundColor: colors.gray[400],
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
    backgroundColor: colors.light,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
});

export default RequestMoneyScreen;
