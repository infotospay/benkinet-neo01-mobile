import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

const PaymentsScreen = ({ navigation }: any) => {
  const paymentOptions = [
    {
      id: 'send',
      title: 'Send Money',
      description: 'Transfer money to another user',
      icon: '↑',
      color: colors.primary,
      onPress: () => navigation.navigate('SendMoney'),
    },
    {
      id: 'request',
      title: 'Request Money',
      description: 'Request money from another user',
      icon: '↓',
      color: colors.secondary,
      onPress: () => navigation.navigate('RequestMoney'),
    },
    {
      id: 'scan',
      title: 'Scan QR Code',
      description: 'Scan a QR code to pay',
      icon: '⊡',
      color: colors.info,
      onPress: () => navigation.navigate('ScanQR'),
    },
    {
      id: 'generate',
      title: 'Generate QR Code',
      description: 'Create a QR code to receive payment',
      icon: '⊞',
      color: colors.success,
      onPress: () => navigation.navigate('GenerateQR'),
    },
    {
      id: 'link',
      title: 'Payment Link',
      description: 'Create a payment link to share',
      icon: '⛓',
      color: colors.warning,
      onPress: () => navigation.navigate('PaymentLink'),
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      description: 'Transfer to/from bank account',
      icon: '🏦',
      color: colors.gray[700],
      onPress: () => navigation.navigate('BankTransfer'),
    },
    {
      id: 'methods',
      title: 'Payment Methods',
      description: 'Manage your payment methods',
      icon: '💳',
      color: colors.purple,
      onPress: () => navigation.navigate('PaymentMethods'),
    },
  ];

  const renderPaymentOption = (option: any) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Payments</Text>
        <Text style={styles.subtitle}>Choose a payment method</Text>

        <View style={styles.optionsContainer}>
          {paymentOptions.map(renderPaymentOption)}
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
  scrollView: {
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
    marginBottom: spacing.lg,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  optionIcon: {
    fontSize: 24,
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
});

export default PaymentsScreen;
