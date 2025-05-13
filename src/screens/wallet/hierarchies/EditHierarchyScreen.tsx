import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store';
import { colors, spacing, typography, borderRadius, shadows } from '../../../theme';
import { apiService } from '../../../api';
import { fetchWalletHierarchies } from '../../../store/slices/walletSlice';

const EditHierarchyScreen = ({ route, navigation }: any) => {
  const { hierarchyId } = route.params;
  const dispatch = useAppDispatch();
  const { hierarchies } = useAppSelector((state) => state.wallet);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHierarchyDetails();
  }, [hierarchyId]);

  const loadHierarchyDetails = async () => {
    try {
      setIsFetching(true);
      setError(null);
      
      // First, check if we already have the hierarchy in the Redux store
      const existingHierarchy = hierarchies.find((h) => h.id === hierarchyId);
      if (existingHierarchy) {
        setName(existingHierarchy.name);
        setDescription(existingHierarchy.description || '');
        setIsDefault(existingHierarchy.isDefault || false);
      }
      
      // Fetch detailed hierarchy information
      const response = await apiService.getHierarchyDetails(hierarchyId);
      const hierarchy = response.data;
      
      setName(hierarchy.name);
      setDescription(hierarchy.description || '');
      setIsDefault(hierarchy.isDefault || false);
    } catch (error: any) {
      console.error('Error loading hierarchy details:', error);
      setError(error.message || 'Failed to load hierarchy details');
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdateHierarchy = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for the hierarchy');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const hierarchyData = {
        id: hierarchyId,
        name: name.trim(),
        description: description.trim(),
        isDefault,
      };
      
      await apiService.updateWalletHierarchy(hierarchyId, hierarchyData);
      
      // Refresh hierarchies list
      await dispatch(fetchWalletHierarchies()).unwrap();
      
      Alert.alert(
        'Success',
        'Wallet hierarchy updated successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Error updating wallet hierarchy:', error);
      setError(error.message || 'Failed to update wallet hierarchy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHierarchy = () => {
    Alert.alert(
      'Delete Hierarchy',
      'Are you sure you want to delete this hierarchy? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDeleteHierarchy },
      ]
    );
  };

  const confirmDeleteHierarchy = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await apiService.deleteWalletHierarchy(hierarchyId);
      
      // Refresh hierarchies list
      await dispatch(fetchWalletHierarchies()).unwrap();
      
      Alert.alert(
        'Success',
        'Wallet hierarchy deleted successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Error deleting wallet hierarchy:', error);
      setError(error.message || 'Failed to delete wallet hierarchy');
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading hierarchy details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Edit Wallet Hierarchy</Text>
        <Text style={styles.subtitle}>
          Update your wallet hierarchy details
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hierarchy Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter hierarchy name"
              placeholderTextColor={colors.gray[400]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter hierarchy description"
              placeholderTextColor={colors.gray[400]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.switchContainer}>
            <View>
              <Text style={styles.label}>Set as Default</Text>
              <Text style={styles.switchDescription}>
                Make this your default hierarchy for new wallets
              </Text>
            </View>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateHierarchy}
          disabled={isLoading}
        >
          <Text style={styles.updateButtonText}>Update Hierarchy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteHierarchy}
          disabled={isLoading}
        >
          <Text style={styles.deleteButtonText}>Delete Hierarchy</Text>
        </TouchableOpacity>
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContent: {
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
    marginBottom: spacing.xl,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  textArea: {
    minHeight: 100,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  updateButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.danger,
    ...shadows.sm,
  },
  deleteButtonText: {
    color: colors.danger,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditHierarchyScreen;
