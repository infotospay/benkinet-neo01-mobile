import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  AnyPaymentMethod,
  PaymentMethodType,
} from '../../store/slices/paymentMethod';
import { AddPaymentMethodForm } from '../../components/payment';

const PaymentMethodsScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { paymentMethods, defaultPaymentMethod, isLoading, error } = useAppSelector(
    (state) => state.paymentMethod
  );
  
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  useEffect(() => {
    loadPaymentMethods();
  }, []);
  
  const loadPaymentMethods = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchPaymentMethods()).unwrap();
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleDelete = (paymentMethodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deletePaymentMethod(paymentMethodId)).unwrap();
            } catch (error) {
              console.error('Error deleting payment method:', error);
            }
          },
        },
      ]
    );
  };
  
  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await dispatch(setDefaultPaymentMethod(paymentMethodId)).unwrap();
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };
  
  const getPaymentMethodIcon = (type: PaymentMethodType) => {
    switch (type) {
      case PaymentMethodType.CARD:
        return '💳';
      case PaymentMethodType.MOBILE_MONEY:
        return '📱';
      case PaymentMethodType.BANK:
        return '🏦';
      case PaymentMethodType.WALLET:
        return '💰';
      case PaymentMethodType.PAYPAL:
        return 'P';
      case PaymentMethodType.CRYPTO:
        return '₿';
      default:
        return '💰';
    }
  };
  
  const getPaymentMethodName = (paymentMethod: AnyPaymentMethod) => {
    switch (paymentMethod.type) {
      case PaymentMethodType.CARD:
        return `${paymentMethod.cardType} •••• ${paymentMethod.maskedCardNumber.slice(-4)}`;
      case PaymentMethodType.MOBILE_MONEY:
        return `${paymentMethod.provider} ${paymentMethod.maskedPhoneNumber}`;
      case PaymentMethodType.BANK:
        return `${paymentMethod.bankName} •••• ${paymentMethod.maskedAccountNumber.slice(-4)}`;
      case PaymentMethodType.WALLET:
        return `Wallet (${paymentMethod.currency})`;
      case PaymentMethodType.PAYPAL:
        return `PayPal (${paymentMethod.email})`;
      case PaymentMethodType.CRYPTO:
        return `${paymentMethod.currency} Wallet`;
      default:
        return 'Unknown Payment Method';
    }
  };
  
  const renderPaymentMethod = ({ item }: { item: AnyPaymentMethod }) => {
    const isDefault = item.id === defaultPaymentMethod?.id;
    
    return (
      <View style={styles.paymentMethodItem}>
        <View style={styles.paymentMethodIcon}>
          <Text style={styles.paymentMethodIconText}>
            {getPaymentMethodIcon(item.type)}
          </Text>
        </View>
        <View style={styles.paymentMethodInfo}>
          <Text style={styles.paymentMethodName}>
            {getPaymentMethodName(item)}
          </Text>
          <Text style={styles.paymentMethodType}>
            {item.type.replace('_', ' ')}
          </Text>
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.paymentMethodActions}>
          {!isDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetDefault(item.id)}
            >
              <Text style={styles.actionButtonText}>Set Default</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No payment methods found.</Text>
      <Text style={styles.emptySubtext}>
        Add a payment method to make payments and transfers.
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Methods</Text>
      </View>
      
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading payment methods...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={paymentMethods}
            renderItem={renderPaymentMethod}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyList}
            refreshing={refreshing}
            onRefresh={loadPaymentMethods}
          />
          
          {paymentMethods.length > 0 && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addButtonText}>Add New Payment Method</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <AddPaymentMethodForm
              onSuccess={() => {
                setShowAddModal(false);
                loadPaymentMethods();
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.dark,
  },
  listContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  paymentMethodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  paymentMethodIconText: {
    fontSize: typography.fontSize.xl,
  },
  paymentMethodInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  paymentMethodName: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  paymentMethodType: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  defaultBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  defaultBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
  },
  paymentMethodActions: {
    justifyContent: 'center',
  },
  actionButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.light,
    marginBottom: spacing.xs,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: colors.danger + '10',
  },
  deleteButtonText: {
    color: colors.danger,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.lg,
    maxHeight: '80%',
  },
});

export default PaymentMethodsScreen;
