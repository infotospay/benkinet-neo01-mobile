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
  Modal,
  FlatList,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { createWallet, fetchWalletHierarchies } from '../../store/slices/walletSlice';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

const CreateWalletScreen = ({ route, navigation }: any) => {
  const { hierarchyId } = route.params || {};
  const dispatch = useAppDispatch();
  const { isLoading, error, hierarchies } = useAppSelector((state) => state.wallet);
  
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [type, setType] = useState('Personal');
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [selectedHierarchy, setSelectedHierarchy] = useState<any>(null);
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);
  const [loadingHierarchies, setLoadingHierarchies] = useState(false);

  useEffect(() => {
    loadCurrencies();
    loadHierarchies();
  }, []);

  useEffect(() => {
    if (hierarchyId && hierarchies.length > 0) {
      const hierarchy = hierarchies.find(h => h.id === hierarchyId);
      if (hierarchy) {
        setSelectedHierarchy(hierarchy);
      }
    }
  }, [hierarchyId, hierarchies]);

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

  const loadHierarchies = async () => {
    try {
      setLoadingHierarchies(true);
      await dispatch(fetchWalletHierarchies()).unwrap();
    } catch (error) {
      console.error('Error loading hierarchies:', error);
    } finally {
      setLoadingHierarchies(false);
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
      hierarchyId: selectedHierarchy?.id,
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

  const renderHierarchyItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.hierarchyItem}
      onPress={() => {
        setSelectedHierarchy(item);
        setShowHierarchyModal(false);
      }}
    >
      <View>
        <Text style={styles.hierarchyName}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.hierarchyDescription}>{item.description}</Text>
        ) : null}
      </View>
      {item.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}
    </TouchableOpacity>
  );

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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Wallet Hierarchy (Optional)</Text>
              <TouchableOpacity
                style={styles.hierarchySelector}
                onPress={() => setShowHierarchyModal(true)}
                disabled={loadingHierarchies}
              >
                {loadingHierarchies ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : selectedHierarchy ? (
                  <View style={styles.selectedHierarchy}>
                    <Text style={styles.selectedHierarchyName}>{selectedHierarchy.name}</Text>
                    {selectedHierarchy.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text style={styles.hierarchySelectorPlaceholder}>
                    Select a hierarchy (optional)
                  </Text>
                )}
              </TouchableOpacity>
              {selectedHierarchy && (
                <TouchableOpacity
                  style={styles.clearHierarchyButton}
                  onPress={() => setSelectedHierarchy(null)}
                >
                  <Text style={styles.clearHierarchyButtonText}>Clear Selection</Text>
                </TouchableOpacity>
              )}
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

      {/* Hierarchy Selection Modal */}
      <Modal
        visible={showHierarchyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHierarchyModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Hierarchy</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowHierarchyModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            {hierarchies.length === 0 ? (
              <View style={styles.emptyHierarchiesContainer}>
                <Text style={styles.emptyHierarchiesText}>
                  No hierarchies found. You can create a wallet without assigning it to a hierarchy.
                </Text>
              </View>
            ) : (
              <FlatList
                data={hierarchies}
                renderItem={renderHierarchyItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.modalList}
              />
            )}
            
            <TouchableOpacity
              style={styles.createHierarchyButton}
              onPress={() => {
                setShowHierarchyModal(false);
                navigation.navigate('CreateHierarchy');
              }}
            >
              <Text style={styles.createHierarchyButtonText}>Create New Hierarchy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  hierarchySelector: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  hierarchySelectorPlaceholder: {
    color: colors.gray[400],
    fontSize: typography.fontSize.md,
  },
  selectedHierarchy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedHierarchyName: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  clearHierarchyButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  clearHierarchyButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
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
  hierarchyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  hierarchyName: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  hierarchyDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  defaultBadge: {
    backgroundColor: colors.primary + '20', // 20% opacity
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  defaultBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyHierarchiesContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyHierarchiesText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
  },
  createHierarchyButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  createHierarchyButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
});

export default CreateWalletScreen;
