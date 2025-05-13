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
  Image,
  Share,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchWallets } from '../../store/slices/walletSlice';
import { formatCurrency } from '../../utils';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

const GenerateQRScreen = ({ route, navigation }: any) => {
  const { walletId } = route.params || {};
  const dispatch = useAppDispatch();
  const { wallets } = useAppSelector((state) => state.wallet);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(walletId || '');
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  
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
  
  const handleGenerateQR = async () => {
    // Reset error and QR code data
    setError(null);
    setQrCodeData(null);
    
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
    
    try {
      setIsLoading(true);
      
      const qrData = {
        walletId: selectedWalletId,
        amount: amount ? parseFloat(amount) : undefined,
        description: description || undefined,
        currency: selectedWallet?.currency,
        type: 'PAYMENT',
      };
      
      const response = await apiService.generateQrCode(qrData);
      setQrCodeData(response.data);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setError(errorResponse.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShareQR = async () => {
    if (!qrCodeData || !qrCodeData.qrCodeUrl) {
      Alert.alert('Error', 'No QR code to share');
      return;
    }
    
    try {
      const message = `
Payment Request
--------------
${amount ? `Amount: ${formatCurrency(parseFloat(amount), selectedWallet?.currency)}` : 'Flexible amount'}
${description ? `Description: ${description}` : ''}
Scan the QR code to pay: ${qrCodeData.qrCodeUrl}
      `;
      
      await Share.share({
        message,
        title: 'Payment QR Code',
        url: qrCodeData.qrCodeUrl,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share QR code');
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
          <Text style={styles.title}>Generate Payment QR</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {qrCodeData ? (
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeTitle}>
                {amount
                  ? `Payment for ${formatCurrency(parseFloat(amount), selectedWallet?.currency)}`
                  : 'Flexible Amount Payment'}
              </Text>
              
              {qrCodeData.qrCodeUrl ? (
                <Image
                  source={{ uri: qrCodeData.qrCodeUrl }}
                  style={styles.qrCodeImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.qrCodePlaceholder}>
                  <Text style={styles.qrCodePlaceholderText}>QR Code</Text>
                </View>
              )}
              
              {description && (
                <Text style={styles.qrCodeDescription}>{description}</Text>
              )}
              
              <View style={styles.qrCodeActions}>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={handleShareQR}
                >
                  <Text style={styles.shareButtonText}>Share QR Code</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.newQrButton}
                  onPress={() => setQrCodeData(null)}
                >
                  <Text style={styles.newQrButtonText}>Generate New QR</Text>
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
              
              <TouchableOpacity
                style={[styles.button, isLoading && styles.disabledButton]}
                onPress={handleGenerateQR}
                disabled={isLoading || !selectedWallet}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.buttonText}>Generate QR Code</Text>
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
  qrCodeContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  qrCodeTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  qrCodeImage: {
    width: 250,
    height: 250,
    marginVertical: spacing.lg,
  },
  qrCodePlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  qrCodePlaceholderText: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[600],
  },
  qrCodeDescription: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  qrCodeActions: {
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
  newQrButton: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  newQrButtonText: {
    color: colors.dark,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
});

export default GenerateQRScreen;
