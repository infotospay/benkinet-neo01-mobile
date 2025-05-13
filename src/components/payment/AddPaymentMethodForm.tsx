import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  createCardPaymentMethod,
  createMobileMoneyPaymentMethod,
  createBankPaymentMethod,
  createPayPalPaymentMethod,
  PaymentMethodType,
  MobileMoneyProvider,
  BankProvider,
} from '../../store/slices/paymentMethod';

interface AddPaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.paymentMethod);
  
  const [paymentMethodType, setPaymentMethodType] = useState<PaymentMethodType>(
    PaymentMethodType.CARD
  );
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  // Mobile Money form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [provider, setProvider] = useState<MobileMoneyProvider>(MobileMoneyProvider.MPESA);
  const [countryCode, setCountryCode] = useState('KE');
  
  // Bank form state
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountHolderName, setBankAccountHolderName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [bankProvider, setBankProvider] = useState<BankProvider>(BankProvider.PESALINK);
  
  // PayPal form state
  const [email, setEmail] = useState('');
  const [paypalAccountHolderName, setPaypalAccountHolderName] = useState('');
  
  const handleSubmit = async () => {
    try {
      switch (paymentMethodType) {
        case PaymentMethodType.CARD:
          await dispatch(
            createCardPaymentMethod({
              cardNumber,
              cardHolderName,
              expiryMonth: parseInt(expiryMonth, 10),
              expiryYear: parseInt(expiryYear, 10),
              cvv,
              isDefault,
            })
          ).unwrap();
          break;
          
        case PaymentMethodType.MOBILE_MONEY:
          await dispatch(
            createMobileMoneyPaymentMethod({
              phoneNumber,
              accountHolderName,
              provider,
              countryCode,
              isDefault,
            })
          ).unwrap();
          break;
          
        case PaymentMethodType.BANK:
          await dispatch(
            createBankPaymentMethod({
              bankName,
              accountHolderName: bankAccountHolderName,
              accountNumber: bankAccountNumber,
              branchCode,
              swiftCode,
              provider: bankProvider,
              isDefault,
            })
          ).unwrap();
          break;
          
        case PaymentMethodType.PAYPAL:
          await dispatch(
            createPayPalPaymentMethod({
              email,
              accountHolderName: paypalAccountHolderName,
              isDefault,
            })
          ).unwrap();
          break;
          
        default:
          throw new Error('Unsupported payment method type');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };
  
  const renderCardForm = () => (
    <View>
      <Text style={styles.fieldLabel}>Card Number</Text>
      <TextInput
        style={styles.input}
        value={cardNumber}
        onChangeText={setCardNumber}
        placeholder="1234 5678 9012 3456"
        keyboardType="number-pad"
        maxLength={19}
      />
      
      <Text style={styles.fieldLabel}>Cardholder Name</Text>
      <TextInput
        style={styles.input}
        value={cardHolderName}
        onChangeText={setCardHolderName}
        placeholder="John Doe"
      />
      
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.fieldLabel}>Expiry Month</Text>
          <TextInput
            style={styles.input}
            value={expiryMonth}
            onChangeText={setExpiryMonth}
            placeholder="MM"
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
        
        <View style={styles.column}>
          <Text style={styles.fieldLabel}>Expiry Year</Text>
          <TextInput
            style={styles.input}
            value={expiryYear}
            onChangeText={setExpiryYear}
            placeholder="YY"
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
        
        <View style={styles.column}>
          <Text style={styles.fieldLabel}>CVV</Text>
          <TextInput
            style={styles.input}
            value={cvv}
            onChangeText={setCvv}
            placeholder="123"
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>
    </View>
  );
  
  const renderMobileMoneyForm = () => (
    <View>
      <Text style={styles.fieldLabel}>Provider</Text>
      <View style={styles.providerContainer}>
        {Object.values(MobileMoneyProvider).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.providerButton,
              provider === p && styles.selectedProviderButton,
            ]}
            onPress={() => setProvider(p)}
          >
            <Text
              style={[
                styles.providerButtonText,
                provider === p && styles.selectedProviderButtonText,
              ]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.fieldLabel}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="+254 712 345 678"
        keyboardType="phone-pad"
      />
      
      <Text style={styles.fieldLabel}>Account Holder Name</Text>
      <TextInput
        style={styles.input}
        value={accountHolderName}
        onChangeText={setAccountHolderName}
        placeholder="John Doe"
      />
      
      <Text style={styles.fieldLabel}>Country Code</Text>
      <TextInput
        style={styles.input}
        value={countryCode}
        onChangeText={setCountryCode}
        placeholder="KE"
        maxLength={2}
      />
    </View>
  );
  
  const renderBankForm = () => (
    <View>
      <Text style={styles.fieldLabel}>Bank Name</Text>
      <TextInput
        style={styles.input}
        value={bankName}
        onChangeText={setBankName}
        placeholder="Bank Name"
      />
      
      <Text style={styles.fieldLabel}>Account Number</Text>
      <TextInput
        style={styles.input}
        value={bankAccountNumber}
        onChangeText={setBankAccountNumber}
        placeholder="1234567890"
        keyboardType="number-pad"
      />
      
      <Text style={styles.fieldLabel}>Account Holder Name</Text>
      <TextInput
        style={styles.input}
        value={bankAccountHolderName}
        onChangeText={setBankAccountHolderName}
        placeholder="John Doe"
      />
      
      <Text style={styles.fieldLabel}>Branch Code (Optional)</Text>
      <TextInput
        style={styles.input}
        value={branchCode}
        onChangeText={setBranchCode}
        placeholder="Branch Code"
      />
      
      <Text style={styles.fieldLabel}>SWIFT Code (Optional)</Text>
      <TextInput
        style={styles.input}
        value={swiftCode}
        onChangeText={setSwiftCode}
        placeholder="SWIFT Code"
      />
      
      <Text style={styles.fieldLabel}>Provider</Text>
      <View style={styles.providerContainer}>
        {Object.values(BankProvider).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.providerButton,
              bankProvider === p && styles.selectedProviderButton,
            ]}
            onPress={() => setBankProvider(p)}
          >
            <Text
              style={[
                styles.providerButtonText,
                bankProvider === p && styles.selectedProviderButtonText,
              ]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  const renderPayPalForm = () => (
    <View>
      <Text style={styles.fieldLabel}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Text style={styles.fieldLabel}>Account Holder Name</Text>
      <TextInput
        style={styles.input}
        value={paypalAccountHolderName}
        onChangeText={setPaypalAccountHolderName}
        placeholder="John Doe"
      />
    </View>
  );
  
  const renderForm = () => {
    switch (paymentMethodType) {
      case PaymentMethodType.CARD:
        return renderCardForm();
      case PaymentMethodType.MOBILE_MONEY:
        return renderMobileMoneyForm();
      case PaymentMethodType.BANK:
        return renderBankForm();
      case PaymentMethodType.PAYPAL:
        return renderPayPalForm();
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Payment Method</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            paymentMethodType === PaymentMethodType.CARD && styles.activeTab,
          ]}
          onPress={() => setPaymentMethodType(PaymentMethodType.CARD)}
        >
          <Text
            style={[
              styles.tabText,
              paymentMethodType === PaymentMethodType.CARD && styles.activeTabText,
            ]}
          >
            Card
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            paymentMethodType === PaymentMethodType.MOBILE_MONEY && styles.activeTab,
          ]}
          onPress={() => setPaymentMethodType(PaymentMethodType.MOBILE_MONEY)}
        >
          <Text
            style={[
              styles.tabText,
              paymentMethodType === PaymentMethodType.MOBILE_MONEY && styles.activeTabText,
            ]}
          >
            Mobile Money
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            paymentMethodType === PaymentMethodType.BANK && styles.activeTab,
          ]}
          onPress={() => setPaymentMethodType(PaymentMethodType.BANK)}
        >
          <Text
            style={[
              styles.tabText,
              paymentMethodType === PaymentMethodType.BANK && styles.activeTabText,
            ]}
          >
            Bank
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            paymentMethodType === PaymentMethodType.PAYPAL && styles.activeTab,
          ]}
          onPress={() => setPaymentMethodType(PaymentMethodType.PAYPAL)}
        >
          <Text
            style={[
              styles.tabText,
              paymentMethodType === PaymentMethodType.PAYPAL && styles.activeTabText,
            ]}
          >
            PayPal
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.formContainer}>
        {renderForm()}
        
        <View style={styles.defaultContainer}>
          <TouchableOpacity
            style={styles.defaultCheckbox}
            onPress={() => setIsDefault(!isDefault)}
          >
            {isDefault && <View style={styles.defaultCheckboxInner} />}
          </TouchableOpacity>
          <Text style={styles.defaultText}>Set as default payment method</Text>
        </View>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
    maxHeight: '80%',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  formContainer: {
    maxHeight: 400,
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: spacing.sm,
  },
  providerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  providerButton: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    margin: spacing.xs,
  },
  selectedProviderButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  providerButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  selectedProviderButtonText: {
    color: colors.primary,
    fontWeight: '500',
  },
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  defaultCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.gray[400],
    borderRadius: 4,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultCheckboxInner: {
    width: 12,
    height: 12,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  defaultText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.light,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cancelButtonText: {
    color: colors.gray[700],
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  addButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
});

export default AddPaymentMethodForm;
