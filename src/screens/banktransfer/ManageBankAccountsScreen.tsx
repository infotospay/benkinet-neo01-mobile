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
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

const ManageBankAccountsScreen = ({ navigation }: any) => {
  const [linkedBanks, setLinkedBanks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadLinkedBanks();
  }, []);
  
  const loadLinkedBanks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
            isDefault: true,
            dateAdded: '2023-05-15',
          },
          {
            id: 'bank2',
            name: 'Bank of America',
            accountNumber: '****5678',
            accountType: 'Savings',
            status: 'Active',
            isDefault: false,
            dateAdded: '2023-06-20',
          },
        ];
        
        setLinkedBanks(simulatedBanks);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      setError(errorResponse.message);
      setIsLoading(false);
    }
  };
  
  const handleSetDefault = (bankId: string) => {
    // In a real implementation, you would call the API to set the default bank
    // For this demo, we'll update the local state
    const updatedBanks = linkedBanks.map((bank) => ({
      ...bank,
      isDefault: bank.id === bankId,
    }));
    
    setLinkedBanks(updatedBanks);
    
    Alert.alert('Success', 'Default bank account updated successfully');
  };
  
  const handleRemoveBank = (bankId: string) => {
    Alert.alert(
      'Remove Bank Account',
      'Are you sure you want to remove this bank account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // In a real implementation, you would call the API to remove the bank
            // For this demo, we'll update the local state
            const updatedBanks = linkedBanks.filter((bank) => bank.id !== bankId);
            setLinkedBanks(updatedBanks);
          },
        },
      ]
    );
  };
  
  const renderBankCard = (bank: any) => (
    <View key={bank.id} style={styles.bankCard}>
      <View style={styles.bankHeader}>
        <Text style={styles.bankName}>{bank.name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: bank.status === 'Active' ? colors.success : colors.warning },
          ]}
        >
          <Text style={styles.statusText}>{bank.status}</Text>
        </View>
      </View>
      
      <View style={styles.bankDetails}>
        <View style={styles.bankDetailRow}>
          <Text style={styles.bankDetailLabel}>Account Number</Text>
          <Text style={styles.bankDetailValue}>{bank.accountNumber}</Text>
        </View>
        <View style={styles.bankDetailRow}>
          <Text style={styles.bankDetailLabel}>Account Type</Text>
          <Text style={styles.bankDetailValue}>{bank.accountType}</Text>
        </View>
        <View style={styles.bankDetailRow}>
          <Text style={styles.bankDetailLabel}>Date Added</Text>
          <Text style={styles.bankDetailValue}>{bank.dateAdded}</Text>
        </View>
        {bank.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      
      <View style={styles.bankActions}>
        {!bank.isDefault && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetDefault(bank.id)}
          >
            <Text style={styles.setDefaultButtonText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveBank(bank.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Manage Bank Accounts</Text>
        <Text style={styles.subtitle}>
          View and manage your linked bank accounts
        </Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading bank accounts...</Text>
          </View>
        ) : linkedBanks.length > 0 ? (
          <View style={styles.banksContainer}>
            {linkedBanks.map(renderBankCard)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bank accounts linked</Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('LinkBankAccount')}
            >
              <Text style={styles.linkButtonText}>Link a Bank Account</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {linkedBanks.length > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('LinkBankAccount')}
          >
            <Text style={styles.addButtonText}>+ Add Another Bank Account</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>
            • You can link up to 5 bank accounts{'\n'}
            • The default account will be used for automatic deposits and withdrawals{'\n'}
            • Bank account verification may take 1-2 business days{'\n'}
            • For security reasons, we only show the last 4 digits of your account number
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
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
  banksContainer: {
    marginBottom: spacing.xl,
  },
  bankCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  bankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bankName: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.round,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
    color: colors.white,
  },
  bankDetails: {
    marginBottom: spacing.md,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  bankDetailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  bankDetailValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.dark,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.round,
    marginTop: spacing.sm,
  },
  defaultText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
    color: colors.white,
  },
  bankActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.md,
  },
  setDefaultButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  setDefaultButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  removeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  removeButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.danger,
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  emptyText: {
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
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
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

export default ManageBankAccountsScreen;
