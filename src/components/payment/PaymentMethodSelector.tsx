import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchPaymentMethods, setDefaultPaymentMethod } from '../../store/slices/paymentMethod';
import { AnyPaymentMethod, PaymentMethodType } from '../../store/slices/paymentMethod/types';

interface PaymentMethodSelectorProps {
  onSelect: (paymentMethod: AnyPaymentMethod) => void;
  selectedPaymentMethodId?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onSelect,
  selectedPaymentMethodId,
}) => {
  const dispatch = useAppDispatch();
  const { paymentMethods, defaultPaymentMethod, isLoading } = useAppSelector(
    (state) => state.paymentMethod
  );
  
  const [selected, setSelected] = useState<string | undefined>(selectedPaymentMethodId);
  
  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);
  
  useEffect(() => {
    if (!selected && defaultPaymentMethod) {
      setSelected(defaultPaymentMethod.id);
      onSelect(defaultPaymentMethod);
    }
  }, [defaultPaymentMethod, selected, onSelect]);
  
  const handleSelect = (paymentMethod: AnyPaymentMethod) => {
    setSelected(paymentMethod.id);
    onSelect(paymentMethod);
  };
  
  const handleSetDefault = (paymentMethod: AnyPaymentMethod) => {
    dispatch(setDefaultPaymentMethod(paymentMethod.id));
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
    const isSelected = selected === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.paymentMethodItem,
          isSelected && styles.selectedPaymentMethodItem,
        ]}
        onPress={() => handleSelect(item)}
      >
        <View style={styles.paymentMethodIcon}>
          <Text style={styles.paymentMethodIconText}>
            {getPaymentMethodIcon(item.type)}
          </Text>
        </View>
        <View style={styles.paymentMethodInfo}>
          <Text style={styles.paymentMethodName}>
            {getPaymentMethodName(item)}
          </Text>
          {item.isDefault && (
            <Text style={styles.defaultLabel}>Default</Text>
          )}
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedIndicatorText}>✓</Text>
          </View>
        )}
        {!item.isDefault && isSelected && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetDefault(item)}
          >
            <Text style={styles.setDefaultButtonText}>Set Default</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading payment methods...</Text>
      </View>
    );
  }
  
  if (paymentMethods.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No payment methods found.</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // Navigate to add payment method screen
          }}
        >
          <Text style={styles.addButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // Navigate to add payment method screen
        }}
      >
        <Text style={styles.addButtonText}>Add New Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  listContainer: {
    paddingBottom: spacing.sm,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  selectedPaymentMethodItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  paymentMethodIconText: {
    fontSize: typography.fontSize.lg,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
    fontWeight: '500',
  },
  defaultLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  selectedIndicatorText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
  },
  setDefaultButton: {
    backgroundColor: colors.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  setDefaultButtonText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginBottom: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
});

export default PaymentMethodSelector;
