import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchWallets } from '../../store/slices/walletSlice';

const BankTransferScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { wallets, isLoading } = useAppSelector((state) => state.wallet);
  
  useEffect(() => {
    if (wallets.length === 0) {
      dispatch(fetchWallets());
    }
  }, []);
  
  const transferOptions = [
    {
      id: 'deposit',
      title: 'Deposit from Bank',
      description: 'Transfer money from your bank account to your wallet',
      icon: '↓',
      color: colors.success,
      onPress: () => navigation.navigate('DepositFromBank'),
    },
    {
      id: 'withdraw',
      title: 'Withdraw to Bank',
      description: 'Transfer money from your wallet to your bank account',
      icon: '↑',
      color: colors.primary,
      onPress: () => navigation.navigate('WithdrawToBank'),
    },
    {
      id: 'link',
      title: 'Link Bank Account',
      description: 'Connect your bank account to your wallet',
      icon: '🔗',
      color: colors.info,
      onPress: () => navigation.navigate('LinkBankAccount'),
    },
    {
      id: 'manage',
      title: 'Manage Bank Accounts',
      description: 'View and manage your linked bank accounts',
      icon: '⚙️',
      color: colors.gray[700],
      onPress: () => navigation.navigate('ManageBankAccounts'),
    },
  ];
  
  const renderTransferOption = (option: any) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionCard}
      onPress={option.onPress}
    >
      <View style={[styles.optionIconContainer, { backgroundColor: option.color }]}>
        <Text style={styles.optionIcon}>{option.icon}</Text>
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionDescription}>{option.description}</Text>
      </View>
    </TouchableOpacity>
  );
  
  if (isLoading && wallets.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading wallet information...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Bank Transfer</Text>
        <Text style={styles.subtitle}>Transfer money between your wallet and bank account</Text>
        
        <View style={styles.optionsContainer}>
          {transferOptions.map(renderTransferOption)}
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>
            • Bank transfers may take 1-3 business days to process{'\n'}
            • Minimum deposit amount: $10{'\n'}
            • Minimum withdrawal amount: $10{'\n'}
            • Transfer fees may apply based on your bank{'\n'}
            • You need to link a bank account before making transfers
          </Text>
        </View>
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
  optionsContainer: {
    marginBottom: spacing.xl,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionIcon: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
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

export default BankTransferScreen;
