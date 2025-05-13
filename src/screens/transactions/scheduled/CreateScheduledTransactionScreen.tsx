import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchWallets } from '../../../store/slices/walletSlice';
import { createScheduledTransaction, RecurrenceType } from '../../../store/slices/scheduledTransactionSlice';
import { colors, spacing, typography, borderRadius, shadows } from '../../../theme';
import { formatCurrency } from '../../../utils';

const CreateScheduledTransactionScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { wallets, isLoading: isLoadingWallets } = useAppSelector((state) => state.wallet);
  const { isLoading: isCreatingTransaction, error } = useAppSelector(
    (state) => state.scheduledTransaction
  );
  
  // Form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [sourceWallet, setSourceWallet] = useState<any>(null);
  const [destinationType, setDestinationType] = useState<'wallet' | 'external'>('wallet');
  const [destinationWallet, setDestinationWallet] = useState<any>(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(RecurrenceType.ONCE);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);
  
  // UI state
  const [showSourceWalletModal, setShowSourceWalletModal] = useState(false);
  const [showDestinationWalletModal, setShowDestinationWalletModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadWallets();
  }, []);
  
  const loadWallets = async () => {
    try {
      await dispatch(fetchWallets()).unwrap();
    } catch (error) {
      console.error('Error loading wallets:', error);
    }
  };
  
  const handleAmountChange = (text: string) => {
    // Allow only numbers and decimal point
    const filteredText = text.replace(/[^0-9.]/g, '');
    setAmount(filteredText);
  };
  
  const handleSourceWalletSelect = (wallet: any) => {
    setSourceWallet(wallet);
    setShowSourceWalletModal(false);
  };
  
  const handleDestinationWalletSelect = (wallet: any) => {
    setDestinationWallet(wallet);
    setShowDestinationWalletModal(false);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      setScheduledDate(selectedDate);
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    
    if (selectedDate) {
      setRecurrenceEndDate(selectedDate);
    }
  };
  
  const showDatePickerModal = (mode: 'date' | 'time') => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };
  
  const showEndDatePickerModal = (mode: 'date' | 'time') => {
    setDatePickerMode(mode);
    setShowEndDatePicker(true);
  };
  
  const handleCreateTransaction = async () => {
    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (!sourceWallet) {
      Alert.alert('Error', 'Please select a source wallet');
      return;
    }
    
    if (destinationType === 'wallet' && !destinationWallet) {
      Alert.alert('Error', 'Please select a destination wallet');
      return;
    }
    
    if (destinationType === 'external' && !recipientPhone && !recipientEmail) {
      Alert.alert('Error', 'Please provide recipient email or phone');
      return;
    }
    
    if (recurrenceType !== RecurrenceType.ONCE && !recurrenceEndDate) {
      Alert.alert('Error', 'Please select an end date for recurring transactions');
      return;
    }
    
    // Create transaction data
    const transactionData: any = {
      amount: parseFloat(amount),
      currency: sourceWallet.currency,
      description,
      sourceWalletId: sourceWallet.id,
      scheduledDate: scheduledDate.toISOString(),
      recurrenceType,
    };
    
    if (recurrenceType !== RecurrenceType.ONCE && recurrenceEndDate) {
      transactionData.recurrenceEndDate = recurrenceEndDate.toISOString();
    }
    
    if (destinationType === 'wallet' && destinationWallet) {
      transactionData.destinationWalletId = destinationWallet.id;
    } else if (destinationType === 'external') {
      transactionData.recipientInfo = {};
      
      if (recipientName) {
        transactionData.recipientInfo.name = recipientName;
      }
      
      if (recipientEmail) {
        transactionData.recipientInfo.email = recipientEmail;
      }
      
      if (recipientPhone) {
        transactionData.recipientInfo.phone = recipientPhone;
      }
    }
    
    try {
      setIsSubmitting(true);
      await dispatch(createScheduledTransaction(transactionData)).unwrap();
      Alert.alert('Success', 'Scheduled transaction created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error creating scheduled transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderWalletItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.walletItem}
      onPress={() => 
        showSourceWalletModal 
          ? handleSourceWalletSelect(item) 
          : handleDestinationWalletSelect(item)
      }
    >
      <View>
        <Text style={styles.walletName}>{item.name}</Text>
        <Text style={styles.walletCurrency}>{item.currency}</Text>
      </View>
      <Text style={styles.walletBalance}>
        {formatCurrency(item.balance, item.currency)}
      </Text>
    </TouchableOpacity>
  );
  
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
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Create Scheduled Transaction</Text>
          <Text style={styles.subtitle}>
            Schedule a transaction for a future date or set up recurring payments
          </Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={handleAmountChange}
                  editable={!isSubmitting}
                />
                <Text style={styles.currencyText}>
                  {sourceWallet?.currency || 'USD'}
                </Text>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                placeholderTextColor={colors.gray[400]}
                value={description}
                onChangeText={setDescription}
                editable={!isSubmitting}
                multiline
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Source Wallet</Text>
              <TouchableOpacity
                style={styles.walletSelector}
                onPress={() => setShowSourceWalletModal(true)}
                disabled={isSubmitting}
              >
                {isLoadingWallets ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : sourceWallet ? (
                  <View style={styles.selectedWallet}>
                    <Text style={styles.selectedWalletName}>{sourceWallet.name}</Text>
                    <Text style={styles.selectedWalletBalance}>
                      {formatCurrency(sourceWallet.balance, sourceWallet.currency)}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.walletSelectorPlaceholder}>
                    Select source wallet
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Destination Type</Text>
              <View style={styles.destinationTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.destinationTypeOption,
                    destinationType === 'wallet' && styles.selectedDestinationTypeOption,
                  ]}
                  onPress={() => setDestinationType('wallet')}
                  disabled={isSubmitting}
                >
                  <Text
                    style={[
                      styles.destinationTypeText,
                      destinationType === 'wallet' && styles.selectedDestinationTypeText,
                    ]}
                  >
                    Wallet
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.destinationTypeOption,
                    destinationType === 'external' && styles.selectedDestinationTypeOption,
                  ]}
                  onPress={() => setDestinationType('external')}
                  disabled={isSubmitting}
                >
                  <Text
                    style={[
                      styles.destinationTypeText,
                      destinationType === 'external' && styles.selectedDestinationTypeText,
                    ]}
                  >
                    External
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {destinationType === 'wallet' ? (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Destination Wallet</Text>
                <TouchableOpacity
                  style={styles.walletSelector}
                  onPress={() => setShowDestinationWalletModal(true)}
                  disabled={isSubmitting}
                >
                  {isLoadingWallets ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : destinationWallet ? (
                    <View style={styles.selectedWallet}>
                      <Text style={styles.selectedWalletName}>{destinationWallet.name}</Text>
                      <Text style={styles.selectedWalletBalance}>
                        {formatCurrency(destinationWallet.balance, destinationWallet.currency)}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.walletSelectorPlaceholder}>
                      Select destination wallet
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Recipient Name (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter recipient name"
                    placeholderTextColor={colors.gray[400]}
                    value={recipientName}
                    onChangeText={setRecipientName}
                    editable={!isSubmitting}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Recipient Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter recipient email"
                    placeholderTextColor={colors.gray[400]}
                    keyboardType="email-address"
                    value={recipientEmail}
                    onChangeText={setRecipientEmail}
                    editable={!isSubmitting}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Recipient Phone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter recipient phone"
                    placeholderTextColor={colors.gray[400]}
                    keyboardType="phone-pad"
                    value={recipientPhone}
                    onChangeText={setRecipientPhone}
                    editable={!isSubmitting}
                  />
                </View>
              </>
            )}
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Scheduled Date</Text>
              <TouchableOpacity
                style={styles.dateSelector}
                onPress={() => showDatePickerModal('date')}
                disabled={isSubmitting}
              >
                <Text style={styles.dateText}>
                  {scheduledDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Scheduled Time</Text>
              <TouchableOpacity
                style={styles.dateSelector}
                onPress={() => showDatePickerModal('time')}
                disabled={isSubmitting}
              >
                <Text style={styles.dateText}>
                  {scheduledDate.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Recurrence</Text>
              <View style={styles.recurrenceOptionsContainer}>
                {renderRecurrenceOption(RecurrenceType.ONCE, 'One-time')}
                {renderRecurrenceOption(RecurrenceType.DAILY, 'Daily')}
                {renderRecurrenceOption(RecurrenceType.WEEKLY, 'Weekly')}
                {renderRecurrenceOption(RecurrenceType.MONTHLY, 'Monthly')}
              </View>
            </View>
            
            {recurrenceType !== RecurrenceType.ONCE && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                  style={styles.dateSelector}
                  onPress={() => showEndDatePickerModal('date')}
                  disabled={isSubmitting}
                >
                  <Text style={styles.dateText}>
                    {recurrenceEndDate
                      ? recurrenceEndDate.toLocaleDateString()
                      : 'Select end date'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.disabledButton]}
              onPress={handleCreateTransaction}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Create Scheduled Transaction</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Source Wallet Modal */}
      <Modal
        visible={showSourceWalletModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSourceWalletModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Source Wallet</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowSourceWalletModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            {isLoadingWallets ? (
              <View style={styles.modalLoadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.modalLoadingText}>Loading wallets...</Text>
              </View>
            ) : wallets.length === 0 ? (
              <View style={styles.modalEmptyContainer}>
                <Text style={styles.modalEmptyText}>
                  No wallets found. Please create a wallet first.
                </Text>
              </View>
            ) : (
              <FlatList
                data={wallets}
                renderItem={renderWalletItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.modalList}
              />
            )}
          </View>
        </View>
      </Modal>
      
      {/* Destination Wallet Modal */}
      <Modal
        visible={showDestinationWalletModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDestinationWalletModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Destination Wallet</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowDestinationWalletModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            {isLoadingWallets ? (
              <View style={styles.modalLoadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.modalLoadingText}>Loading wallets...</Text>
              </View>
            ) : wallets.length === 0 ? (
              <View style={styles.modalEmptyContainer}>
                <Text style={styles.modalEmptyText}>
                  No wallets found. Please create a wallet first.
                </Text>
              </View>
            ) : (
              <FlatList
                data={wallets.filter(wallet => wallet.id !== sourceWallet?.id)}
                renderItem={renderWalletItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.modalList}
              />
            )}
          </View>
        </View>
      </Modal>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={scheduledDate}
          mode={datePickerMode}
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {/* End Date Picker */}
      {showEndDatePicker && (
        <DateTimePicker
          value={recurrenceEndDate || new Date()}
          mode={datePickerMode}
          is24Hour={true}
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
    backgroundColor: colors.light,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
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
  form: {
    marginBottom: spacing.xl,
  },
  formGroup: {
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
    backgroundColor: colors.white,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
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
  walletSelector: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  walletSelectorPlaceholder: {
    color: colors.gray[400],
    fontSize: typography.fontSize.md,
  },
  selectedWallet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedWalletName: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  selectedWalletBalance: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  destinationTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  destinationTypeOption: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  selectedDestinationTypeOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  destinationTypeText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  selectedDestinationTypeText: {
    color: colors.white,
    fontWeight: '500',
  },
  dateSelector: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  dateText: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  recurrenceOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: spacing.lg,
  },
  disabledButton: {
    backgroundColor: colors.gray[400],
  },
  submitButtonText: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
  },
  modalCloseButton: {
    padding: spacing.sm,
  },
  modalCloseButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  modalList: {
    padding: spacing.md,
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  walletName: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  walletCurrency: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  walletBalance: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  modalLoadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalLoadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  modalEmptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalEmptyText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
  },
});

export default CreateScheduledTransactionScreen;
