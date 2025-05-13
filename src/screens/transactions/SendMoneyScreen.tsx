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
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { createTransaction } from '../../store/slices/transactionSlice';
import { createScheduledTransaction, RecurrenceType } from '../../store/slices/scheduledTransactionSlice';
import { fetchWallets } from '../../store/slices/walletSlice';
import { formatCurrency } from '../../utils';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

const SendMoneyScreen = ({ route, navigation }: any) => {
  const { walletId } = route.params || {};
  const dispatch = useAppDispatch();
  const { wallets } = useAppSelector((state) => state.wallet);
  const { isLoading, error } = useAppSelector((state) => state.transaction);
  const { isLoading: isSchedulingLoading } = useAppSelector((state) => state.scheduledTransaction);
  
  const [amount, setAmount] = useState('');
  const [recipientIdentifier, setRecipientIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(walletId || '');
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [fee, setFee] = useState<number | null>(null);
  const [calculatingFee, setCalculatingFee] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Confirmation
  
  // Scheduling options
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(RecurrenceType.ONCE);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
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
  
  useEffect(() => {
    if (amount && selectedWallet) {
      calculateFee();
    }
  }, [amount, selectedWallet]);
  
  const calculateFee = async () => {
    if (!amount || !selectedWallet) return;
    
    try {
      setCalculatingFee(true);
      const response = await apiService.calculateTransactionFee({
        amount: parseFloat(amount),
        currency: selectedWallet.currency,
        type: 'TRANSFER',
      });
      setFee(response.fee);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      console.error('Error calculating fee:', errorResponse.message);
      setFee(null);
    } finally {
      setCalculatingFee(false);
    }
  };
  
  const handleWalletChange = (id: string) => {
    setSelectedWalletId(id);
    const wallet = wallets.find((w) => w.id === id);
    setSelectedWallet(wallet);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      const newDate = new Date(scheduledDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setScheduledDate(newDate);
    }
  };
  
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    
    if (selectedTime) {
      const newDate = new Date(scheduledDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setScheduledDate(newDate);
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    
    if (selectedDate) {
      setRecurrenceEndDate(selectedDate);
    }
  };
  
  const handleContinue = () => {
    // Validate inputs
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    
    if (!recipientIdentifier.trim()) {
      Alert.alert('Error', 'Please enter recipient email or phone');
      return;
    }
    
    if (!selectedWalletId) {
      Alert.alert('Error', 'Please select a wallet');
      return;
    }
    
    // Check if amount is valid
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    // Check if wallet has sufficient balance
    if (selectedWallet && amountValue > selectedWallet.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }
    
    // Validate scheduled transaction
    if (isScheduled) {
      // Check if scheduled date is in the future
      const now = new Date();
      if (scheduledDate <= now) {
        Alert.alert('Error', 'Scheduled date must be in the future');
        return;
      }
      
      // Check if recurrence end date is after scheduled date
      if (recurrenceType !== RecurrenceType.ONCE && recurrenceEndDate) {
        if (recurrenceEndDate <= scheduledDate) {
          Alert.alert('Error', 'Recurrence end date must be after scheduled date');
          return;
        }
      }
      
      // Check if recurrence end date is set for recurring transactions
      if (recurrenceType !== RecurrenceType.ONCE && !recurrenceEndDate) {
        Alert.alert('Error', 'Please set an end date for recurring transactions');
        return;
      }
    }
    
    // Move to confirmation step
    setStep(2);
  };
  
  const handleSendMoney = async () => {
    if (!selectedWallet) return;
    
    if (isScheduled) {
      // Create scheduled transaction
      const scheduledTransactionData = {
        amount: parseFloat(amount),
        currency: selectedWallet.currency,
        sourceWalletId: selectedWalletId,
        recipientInfo: {
          email: recipientIdentifier.includes('@') ? recipientIdentifier : undefined,
          phone: !recipientIdentifier.includes('@') ? recipientIdentifier : undefined,
        },
        description: description || 'Money Transfer',
        scheduledDate: scheduledDate.toISOString(),
        recurrenceType,
        recurrenceEndDate: recurrenceEndDate ? recurrenceEndDate.toISOString() : undefined,
      };
      
      try {
        await dispatch(createScheduledTransaction(scheduledTransactionData)).unwrap();
        Alert.alert(
          'Success',
          'Transaction scheduled successfully',
          [
            {
              text: 'View Scheduled Transactions',
              onPress: () => navigation.navigate('ScheduledTransactions'),
            },
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      } catch (error) {
        // Error is handled by the reducer and displayed in the UI
      }
    } else {
      // Create immediate transaction
      const transactionData = {
        amount: parseFloat(amount),
        currency: selectedWallet.currency,
        sourceWalletId: selectedWalletId,
        recipientIdentifier: recipientIdentifier,
        description: description || 'Money Transfer',
        type: 'TRANSFER',
      };
      
      try {
        await dispatch(createTransaction(transactionData)).unwrap();
        Alert.alert(
          'Success',
          'Money sent successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      } catch (error) {
        // Error is handled by the reducer and displayed in the UI
      }
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
  
  const renderRecurrenceOption = (type: RecurrenceType, label: string) => (
    <TouchableOpacity
      style={[
        styles.recurrenceOption,
        recurrenceType === type && styles.selectedRecurrenceOption,
      ]}
      onPress={() => setRecurrenceType(type)}
    >
      <Text
        style={[
          styles.recurrenceOptionText,
          recurrenceType === type && styles.selectedRecurrenceOptionText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const renderDetailsStep = () => {
    return (
      <>
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
          <Text style={styles.label}>From Wallet</Text>
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
          <Text style={styles.label}>Recipient (Email or Phone)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipient email or phone"
            placeholderTextColor={colors.gray[400]}
            value={recipientIdentifier}
            onChangeText={setRecipientIdentifier}
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
        
        <View style={styles.schedulingContainer}>
          <View style={styles.schedulingHeader}>
            <Text style={styles.label}>Schedule for later?</Text>
            <Switch
              value={isScheduled}
              onValueChange={setIsScheduled}
              trackColor={{ false: colors.gray[300], true: colors.primary + '80' }}
              thumbColor={isScheduled ? colors.primary : colors.gray[100]}
            />
          </View>
          
          {isScheduled && (
            <View style={styles.schedulingOptions}>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {scheduledDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.label}>Recurrence</Text>
              <View style={styles.recurrenceOptionsContainer}>
                {renderRecurrenceOption(RecurrenceType.ONCE, 'One-time')}
                {renderRecurrenceOption(RecurrenceType.DAILY, 'Daily')}
                {renderRecurrenceOption(RecurrenceType.WEEKLY, 'Weekly')}
                {renderRecurrenceOption(RecurrenceType.MONTHLY, 'Monthly')}
              </View>
              
              {recurrenceType !== RecurrenceType.ONCE && (
                <View style={styles.endDateContainer}>
                  <Text style={styles.label}>End Date</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text style={styles.datePickerButtonText}>
                      {recurrenceEndDate
                        ? recurrenceEndDate.toLocaleDateString()
                        : 'Select end date'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
        
        {fee !== null && (
          <View style={styles.feeContainer}>
            <Text style={styles.feeLabel}>Transaction Fee:</Text>
            <Text style={styles.feeAmount}>
              {calculatingFee ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                formatCurrency(fee, selectedWallet?.currency || 'USD')
              )}
            </Text>
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.button, (isLoading || isSchedulingLoading) && styles.disabledButton]}
          onPress={handleContinue}
          disabled={isLoading || isSchedulingLoading || !selectedWallet}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </>
    );
  };
  
  const renderConfirmationStep = () => {
    const totalAmount = parseFloat(amount) + (fee || 0);
    
    return (
      <>
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationTitle}>Transaction Summary</Text>
          
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Amount:</Text>
            <Text style={styles.confirmationValue}>
              {formatCurrency(parseFloat(amount), selectedWallet?.currency || 'USD')}
            </Text>
          </View>
          
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Fee:</Text>
            <Text style={styles.confirmationValue}>
              {formatCurrency(fee || 0, selectedWallet?.currency || 'USD')}
            </Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Total:</Text>
            <Text style={styles.confirmationTotalValue}>
              {formatCurrency(totalAmount, selectedWallet?.currency || 'USD')}
            </Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>From:</Text>
            <Text style={styles.confirmationValue}>{selectedWallet?.name}</Text>
          </View>
          
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>To:</Text>
            <Text style={styles.confirmationValue}>{recipientIdentifier}</Text>
          </View>
          
          {description && (
            <View style={styles.confirmationRow}>
              <Text style={styles.confirmationLabel}>Description:</Text>
              <Text style={styles.confirmationValue}>{description}</Text>
            </View>
          )}
          
          {isScheduled && (
            <>
              <View style={styles.separator} />
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Scheduled Date:</Text>
                <Text style={styles.confirmationValue}>
                  {scheduledDate.toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Scheduled Time:</Text>
                <Text style={styles.confirmationValue}>
                  {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Recurrence:</Text>
                <Text style={styles.confirmationValue}>
                  {recurrenceType === RecurrenceType.ONCE
                    ? 'One-time'
                    : recurrenceType === RecurrenceType.DAILY
                    ? 'Daily'
                    : recurrenceType === RecurrenceType.WEEKLY
                    ? 'Weekly'
                    : 'Monthly'}
                </Text>
              </View>
              
              {recurrenceType !== RecurrenceType.ONCE && recurrenceEndDate && (
                <View style={styles.confirmationRow}>
                  <Text style={styles.confirmationLabel}>End Date:</Text>
                  <Text style={styles.confirmationValue}>
                    {recurrenceEndDate.toLocaleDateString()}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.secondaryButton, (isLoading || isSchedulingLoading) && styles.disabledButton]}
            onPress={() => setStep(1)}
            disabled={isLoading || isSchedulingLoading}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, (isLoading || isSchedulingLoading) && styles.disabledButton]}
            onPress={handleSendMoney}
            disabled={isLoading || isSchedulingLoading}
          >
            {isLoading || isSchedulingLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>
                {isScheduled ? 'Schedule Transaction' : 'Send Money'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Send Money</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {step === 1 ? renderDetailsStep() : renderConfirmationStep()}
        </ScrollView>
      </KeyboardAvoidingView>
      
      {showDatePicker && (
        <DateTimePicker
          value={scheduledDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={scheduledDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={recurrenceEndDate || new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
          minimumDate={scheduledDate}
        />
      )}
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
  schedulingContainer: {
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  schedulingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.light,
  },
  schedulingOptions: {
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  datePickerButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.white,
  },
  datePickerButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  recurrenceOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    marginHorizontal: -spacing.xs,
  },
  recurrenceOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    margin: spacing.xs,
  },
  selectedRecurrenceOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  recurrenceOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  selectedRecurrenceOptionText: {
    color: colors.white,
    fontWeight: '500',
  },
  endDateContainer: {
    marginTop: spacing.sm,
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
  },
  feeLabel: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  feeAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
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
  confirmationCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  confirmationTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  confirmationLabel: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
  },
  confirmationValue: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  confirmationTotalValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginRight: spacing.md,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
});

export default SendMoneyScreen;
