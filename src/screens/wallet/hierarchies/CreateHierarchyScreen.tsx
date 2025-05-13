import React, { useState } from 'react';
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
import { useAppDispatch } from '../../../store';
import { colors, spacing, typography, borderRadius, shadows } from '../../../theme';
import { apiService } from '../../../api';
import { fetchWalletHierarchies } from '../../../store/slices/walletSlice';

const CreateHierarchyScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateHierarchy = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for the hierarchy');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const hierarchyData = {
        name: name.trim(),
        description: description.trim(),
        isDefault,
      };
      
      await apiService.createWalletHierarchy(hierarchyData);
      
      // Refresh hierarchies list
      await dispatch(fetchWalletHierarchies()).unwrap();
      
      Alert.alert(
        'Success',
        'Wallet hierarchy created successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Error creating wallet hierarchy:', error);
      setError(error.message || 'Failed to create wallet hierarchy');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Wallet Hierarchy</Text>
        <Text style={styles.subtitle}>
          Organize your wallets by creating a hierarchy
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

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What is a Wallet Hierarchy?</Text>
          <Text style={styles.infoText}>
            A wallet hierarchy allows you to organize your wallets into groups. This can be useful for:
            {'\n\n'}
            • Separating personal and business wallets
            {'\n'}
            • Organizing wallets by purpose or project
            {'\n'}
            • Managing wallets for different family members
            {'\n'}
            • Creating budget categories
            {'\n\n'}
            You can transfer funds between wallets in the same hierarchy.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateHierarchy}
          disabled={isLoading}
        >
          <Text style={styles.createButtonText}>Create Hierarchy</Text>
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
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
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
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  createButtonText: {
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateHierarchyScreen;
