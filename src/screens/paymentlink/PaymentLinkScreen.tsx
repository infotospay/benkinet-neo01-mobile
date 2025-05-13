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
  Share,
  Clipboard,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchWallets } from '../../store/slices/walletSlice';
import { formatCurrency } from '../../utils';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

const PaymentLinkScreen = ({ route, navigation }: any) => {
  const { walletId } = route.params || {};
  const dispatch = useAppDispatch();
  const { wallets } = useAppSelector((state) => state.wallet);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDays, setExpiryDays] = useState('7');
  const [selectedWalletId, setSelectedWalletId] = useState(walletId || '');
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  
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
  
  const handleGenerateLink = async () => {
    // Reset error and payment link
    setError(null);
    setPaymentLink(null);
    
    // Validate inputs
    if (!selectedWalletId) {
      setError('Please select a wallet');
      return;
    }
    
    // Amount is optional, but if provided, it must be valid
    if (amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Expiry days is required and must be a valid number
    if (!expiryDays || isNaN(parseInt(expiryDays)) || parseInt(expiryDays) <= 0) {
      setError('Please enter a valid expiry period');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const linkData = {
        walletId: selectedWalletId,
        amount: amount ? parseFloat(amount) : undefined,
        description: description || undefined,
        expiryDays: parseInt(expiryDays),
        currency: selectedWallet?.currency,
      };
      
      // In a real implementation, you would call the API to generate a payment link
      // For this demo, we'll simulate a response
      // const response = await apiService.createPaymentLink(linkData);
      
      // Simulate API response
      setTimeout(() => {
        const simulatedResponse = {
          data: {
            paymentLink: `https://pay.benkinet.com/${Math.random().toString(36).substring(2, 15)}`,
            expiresAt: new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000).toISOString(),
          },
        };
        
        setPaymentLink(simulatedResponse.data.paymentLink);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setError(errorResponse.message);
      setIsLoading(false);
    }
  };
  
  const handleShareLink = async () => {
    if (!paymentLink) {
      Alert.alert('Error', 'No payment link to share');
      return;
    }
    
    try {
      const message = `
Payment Request
--------------
${amount ? `Amount: ${formatCurrency(parseFloat(amount), selectedWallet?.currency)}` : 'Flexible amount'}
${description ? `Description: ${description}` : ''}
Use this link to pay: ${paymentLink}
      `;
      
      await Share.share({
        message,
        title: 'Payment Link',
        url: paymentLink,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share payment link');
    }
  };
  
  const handleCopyLink = () => {
    if (!paymentLink) {
      Alert.alert('Error', 'No payment link to copy');
      return;
    }
    
    Clipboard.setString(paymentLink);
    Alert.alert('Success', 'Payment link copied to clipboard');
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
          <Text style={styles.title}>Payment Link</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {paymentLink ? (
            <View style={styles.linkContainer}>
              <Text style={styles.linkTitle}>
                {amount
                  ? `Payment for ${formatCurrency(parseFloat(amount), selectedWallet?.currency)}`
                  : 'Flexible Amount Payment'}
              </Text>
              
              <View style={styles.linkBox}>
                <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="middle">
                  {paymentLink}
                </Text>
              </View>
              
              {description && (
                <Text style={styles.linkDescription}>{description}</Text>
              )}
              
              <Text style={styles.linkExpiry}>
                Expires in {expiryDays} {parseInt(expiryDays) === 1 ? 'day' : 'days'}
              </Text>
              
              <View style={styles.linkActions}>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={handleShareLink}
                >
                  <Text style={styles.shareButtonText}>Share Link</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={handleCopyLink}
                >
                  <Text style={styles.copyButtonText}>Copy Link</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.newLinkButton}
                  onPress={() => setPaymentLink(null)}
                >
                  <Text style={styles.newLinkButtonText}>Generate New Link</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Receiving Wallet</Text>
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
                <Text style={styles.label}>Amount (Optional)</Text>
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
                <Text style={styles.helperText}>
                  Leave blank for flexible amount
                </Text>
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
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Expiry (Days)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="7"
                  placeholderTextColor={colors.gray[400]}
                  value={expiryDays}
                  onChangeText={setExpiryDays}
                  keyboardType="number-pad"
                  editable={!isLoading}
                />
              </View>
              
              <TouchableOpacity
                style={[styles.button, isLoading && styles.disabledButton]}
                onPress={handleGenerateLink}
                disabled={isLoading || !selectedWallet}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.buttonText}>Generate Payment Link</Text>
                )}
              </TouchableOpacity>
            </>
          )}
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
  helperText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
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
  button: {
    backgroundColor: colors.primary,
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
  linkContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  linkTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  linkBox: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    width: '100%',
    marginBottom: spacing.md,
  },
  linkText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    textAlign: 'center',
  },
  linkDescription: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  linkExpiry: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.lg,
  },
  linkActions: {
    width: '100%',
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shareButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  copyButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  newLinkButton: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  newLinkButtonText: {
    color: colors.dark,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
});

export default PaymentLinkScreen;
