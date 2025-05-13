import React, { useState } from 'react';
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
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

const LinkBankAccountScreen = ({ navigation }: any) => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountType, setAccountType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const accountTypes = [
    { id: 'checking', label: 'Checking' },
    { id: 'savings', label: 'Savings' },
  ];
  
  const handleLinkAccount = async () => {
    // Reset error
    setError(null);
    
    // Validate inputs
    if (!bankName.trim()) {
      setError('Please enter bank name');
      return;
    }
    
    if (!accountNumber.trim()) {
      setError('Please enter account number');
      return;
    }
    
    if (!routingNumber.trim()) {
      setError('Please enter routing number');
      return;
    }
    
    if (!accountType) {
      setError('Please select account type');
      return;
    }
    
    // Validate account number format (simple validation)
    if (!/^\d{8,17}$/.test(accountNumber.trim())) {
      setError('Account number should be 8-17 digits');
      return;
    }
    
    // Validate routing number format (simple validation)
    if (!/^\d{9}$/.test(routingNumber.trim())) {
      setError('Routing number should be 9 digits');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const bankData = {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        routingNumber: routingNumber.trim(),
        accountType,
      };
      
      // In a real implementation, you would call the API to link the bank account
      // For this demo, we'll simulate a response
      // const response = await apiService.linkBankAccount(bankData);
      
      // Simulate API response
      setTimeout(() => {
        setIsLoading(false);
        
        Alert.alert(
          'Bank Account Linked',
          'Your bank account has been successfully linked to your wallet.',
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
  
  const renderAccountTypeOption = (type: any) => {
    const isSelected = accountType === type.id;
    return (
      <TouchableOpacity
        key={type.id}
        style={[
          styles.accountTypeOption,
          isSelected && styles.selectedAccountTypeOption,
        ]}
        onPress={() => setAccountType(type.id)}
      >
        <View
          style={[
            styles.accountTypeRadio,
            isSelected && styles.selectedAccountTypeRadio,
          ]}
        >
          {isSelected && <View style={styles.accountTypeRadioInner} />}
        </View>
        <Text
          style={[
            styles.accountTypeLabel,
            isSelected && styles.selectedAccountTypeLabel,
          ]}
        >
          {type.label}
        </Text>
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
          <Text style={styles.title}>Link Bank Account</Text>
          <Text style={styles.subtitle}>
            Connect your bank account to your wallet for deposits and withdrawals
          </Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter bank name"
                placeholderTextColor={colors.gray[400]}
                value={bankName}
                onChangeText={setBankName}
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account number"
                placeholderTextColor={colors.gray[400]}
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
                editable={!isLoading}
                secureTextEntry
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Routing Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter routing number"
                placeholderTextColor={colors.gray[400]}
                value={routingNumber}
                onChangeText={setRoutingNumber}
                keyboardType="number-pad"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Account Type</Text>
              <View style={styles.accountTypeContainer}>
                {accountTypes.map(renderAccountTypeOption)}
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleLinkAccount}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Link Bank Account</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Important Information</Text>
            <Text style={styles.infoText}>
              • Your bank account information is securely encrypted{'\n'}
              • We use industry-standard security measures to protect your data{'\n'}
              • Bank verification may take 1-2 business days{'\n'}
              • You may be required to verify small deposits to your account
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
  form: {
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
  },
  selectedAccountTypeOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  accountTypeRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  selectedAccountTypeRadio: {
    borderColor: colors.white,
  },
  accountTypeRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  accountTypeLabel: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  selectedAccountTypeLabel: {
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: spacing.md,
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

export default LinkBankAccountScreen;
