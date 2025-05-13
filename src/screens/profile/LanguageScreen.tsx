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
import { useAppDispatch, useAppSelector } from '../../store';
import { updateLanguageSettings } from '../../store/slices/authSlice';

const LanguageScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const languages = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'fr', name: 'Français', flag: '🇫🇷' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { id: 'pt', name: 'Português', flag: '🇵🇹' },
    { id: 'it', name: 'Italiano', flag: '🇮🇹' },
    { id: 'ar', name: 'العربية', flag: '🇸🇦' },
    { id: 'zh', name: '中文', flag: '🇨🇳' },
    { id: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { id: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { id: 'so', name: 'Soomaali', flag: '🇸🇴' },
  ];
  
  useEffect(() => {
    if (user && user.languageSettings) {
      setSelectedLanguage(user.languageSettings.language || 'en');
    }
  }, [user]);
  
  const handleSelectLanguage = async (languageId: string) => {
    try {
      setSelectedLanguage(languageId);
      
      const languageSettings = {
        language: languageId,
      };
      
      await dispatch(updateLanguageSettings(languageSettings)).unwrap();
      
      Alert.alert(
        'Language Updated',
        'Your language preference has been updated successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error updating language settings:', error);
      Alert.alert('Error', 'Failed to update language settings. Please try again.');
    }
  };
  
  if (isLoading && !user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading language settings...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Language Settings</Text>
        <Text style={styles.subtitle}>
          Choose your preferred language
        </Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.languageList}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.id}
              style={[
                styles.languageItem,
                selectedLanguage === language.id && styles.selectedLanguageItem,
              ]}
              onPress={() => handleSelectLanguage(language.id)}
            >
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <Text
                style={[
                  styles.languageName,
                  selectedLanguage === language.id && styles.selectedLanguageName,
                ]}
              >
                {language.name}
              </Text>
              {selectedLanguage === language.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Language Support</Text>
          <Text style={styles.infoText}>
            • The app interface will be displayed in your selected language{'\n'}
            • Some content, such as transaction descriptions, may remain in the original language{'\n'}
            • Customer support is available in English, French, Spanish, Arabic, Swahili, Amharic, and Somali{'\n'}
            • Additional languages are being added regularly
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
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
  languageList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  selectedLanguageItem: {
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  languageFlag: {
    fontSize: typography.fontSize.xl,
    marginRight: spacing.md,
  },
  languageName: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
    flex: 1,
  },
  selectedLanguageName: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
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
  errorText: {
    color: colors.danger,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
});

export default LanguageScreen;
