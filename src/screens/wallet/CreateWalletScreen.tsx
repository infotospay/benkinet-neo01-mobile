import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { createWallet } from '../../store/slices/walletSlice';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

const CreateWalletScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.wallet);
  
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [type, setType] = useState('Personal');
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  useEffect(() => {
    loadCurrencies();
  }, []);

  const loadCurrencies = async () => {
    try {
      setLoadingCurrencies(true);
      const response = await apiService.getCurrencies();
      setCurrencies(response.data || []);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      Alert.alert('Error', errorResponse.message);
    } finally {
      setLoadingCurrencies(false);
    }
  };

  const handleCreateWallet = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a wallet name');
      return;
    }

    const walletData = {
      name: name.trim(),
      currency,
      type,
    };

    try {
      await dispatch(createWallet(walletData)).unwrap();
      Alert.alert('Success', 'Wallet created successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      // Error is handled by the reducer and displayed in the UI
    }
  };

  const renderCurrencyOption = (currencyOption: string) => {
    const isSelected = currency === currencyOption;
    return (
      <TouchableOpacity
        key={currencyOption}
        style={[
          styles.currencyOption,
          isSelected && styles.selectedCurrencyOption,
        ]}
        onPress={() => setCurrency(currencyOption)}
      >
        <Text
          style={[
            styles.currencyOptionText,
            isSelected && styles.selectedCurrencyOptionText,
          ]}
        >
          {currencyOption}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTypeOption = (typeOption: string) => {
    const isSelected = type === typeOption;
    return (
      <TouchableOpacity
        key={typeOption}
        style={[
          styles.typeOption,
          isSelected && styles.selectedTypeOption,
        ]}
        onPress={() => setType(typeOption)}
      >
        <Text
          style={[
            styles.typeOptionText,
            isSelected && styles.selectedTypeOptionText,
          ]}
        >
          {typeOption}
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
          <Text style={styles.title}>Create New Wallet</Text>
          <Text style={styles.subtitle}>
            Create a new wallet to manage your funds in different currencies.
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Wallet Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter wallet name"
                placeholderTextColor={colors.gray[400]}
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Currency</Text>
              {loadingCurrencies ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.currencyOptionsContainer}
                >
                  {currencies.length > 0 ? (
                    currencies.map((currencyItem) => renderCurrencyOption(currencyItem.code))
                  ) : (
                    <>
                      {renderCurrencyOption('USD')}
                      {renderCurrencyOption('EUR')}
                      {renderCurrencyOption('GBP')}
                      {renderCurrencyOption('KES')}
                      {renderCurrencyOption('UGX')}
                      {renderCurrencyOption('TZS')}
                      {renderCurrencyOption('RWF')}
                    </>
                  )}
                </ScrollView>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Wallet Type</Text>
              <View style={styles.typeOptionsContainer}>
                {renderTypeOption('Personal')}
                {renderTypeOption('Business')}
                {renderTypeOption('Savings')}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleCreateWallet}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.buttonText}>Create Wallet</Text>
              )}
            </TouchableOpacity>
          </View>
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
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  currencyOptionsContainer: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  currencyOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.light,
    marginRight: spacing.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedCurrencyOption: {
    backgroundColor: colors.primary,
  },
  currencyOptionText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  selectedCurrencyOptionText: {
    color: colors.white,
    fontWeight: '500',
  },
  typeOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeOption: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.light,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  selectedTypeOption: {
    backgroundColor: colors.primary,
  },
  typeOptionText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  selectedTypeOptionText: {
    color: colors.white,
    fontWeight: '500',
  },
  button: {
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
});

export default CreateWalletScreen;
