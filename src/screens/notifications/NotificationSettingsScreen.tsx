import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  updateNotificationSettings,
  NotificationType,
} from '../../store/slices/notificationSlice';

const NotificationSettingsScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { settings, isLoading, error } = useAppSelector((state) => state.notification);
  
  const [transactionNotifications, setTransactionNotifications] = useState(true);
  const [securityNotifications, setSecurityNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(false);
  
  useEffect(() => {
    if (settings) {
      setTransactionNotifications(settings.transactionNotifications);
      setSecurityNotifications(settings.securityNotifications);
      setMarketingNotifications(settings.marketingNotifications);
      setSystemNotifications(settings.systemNotifications);
      setPushNotificationsEnabled(settings.pushNotificationsEnabled);
      setEmailNotificationsEnabled(settings.emailNotificationsEnabled);
      setSmsNotificationsEnabled(settings.smsNotificationsEnabled);
    }
  }, [settings]);
  
  const handleToggleTransactionNotifications = async (value: boolean) => {
    setTransactionNotifications(value);
    await saveSettings({ transactionNotifications: value });
  };
  
  const handleToggleSecurityNotifications = async (value: boolean) => {
    setSecurityNotifications(value);
    await saveSettings({ securityNotifications: value });
  };
  
  const handleToggleMarketingNotifications = async (value: boolean) => {
    setMarketingNotifications(value);
    await saveSettings({ marketingNotifications: value });
  };
  
  const handleToggleSystemNotifications = async (value: boolean) => {
    setSystemNotifications(value);
    await saveSettings({ systemNotifications: value });
  };
  
  const handleTogglePushNotifications = async (value: boolean) => {
    setPushNotificationsEnabled(value);
    await saveSettings({ pushNotificationsEnabled: value });
  };
  
  const handleToggleEmailNotifications = async (value: boolean) => {
    setEmailNotificationsEnabled(value);
    await saveSettings({ emailNotificationsEnabled: value });
  };
  
  const handleToggleSmsNotifications = async (value: boolean) => {
    setSmsNotificationsEnabled(value);
    await saveSettings({ smsNotificationsEnabled: value });
  };
  
  const saveSettings = async (updatedSettings: any) => {
    try {
      await dispatch(updateNotificationSettings(updatedSettings)).unwrap();
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings. Please try again.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Notification Settings</Text>
        <Text style={styles.subtitle}>
          Manage your notification preferences
        </Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <Text style={styles.sectionDescription}>
            Choose which types of notifications you want to receive
          </Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Transaction Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications for deposits, withdrawals, and payments
              </Text>
            </View>
            <Switch
              value={transactionNotifications}
              onValueChange={handleToggleTransactionNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
              disabled={isLoading}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Security Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications about login attempts and security alerts
              </Text>
            </View>
            <Switch
              value={securityNotifications}
              onValueChange={handleToggleSecurityNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
              disabled={isLoading}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Marketing Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications about promotions and special offers
              </Text>
            </View>
            <Switch
              value={marketingNotifications}
              onValueChange={handleToggleMarketingNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
              disabled={isLoading}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>System Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications about app updates and maintenance
              </Text>
            </View>
            <Switch
              value={systemNotifications}
              onValueChange={handleToggleSystemNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
              disabled={isLoading}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Channels</Text>
          <Text style={styles.sectionDescription}>
            Choose how you want to receive notifications
          </Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications on your device
              </Text>
            </View>
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={handleTogglePushNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
              disabled={isLoading}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Email Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications via email
              </Text>
            </View>
            <Switch
              value={emailNotificationsEnabled}
              onValueChange={handleToggleEmailNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
              disabled={isLoading}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>SMS Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications via SMS (charges may apply)
              </Text>
            </View>
            <Switch
              value={smsNotificationsEnabled}
              onValueChange={handleToggleSmsNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
              disabled={isLoading}
            />
          </View>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>
            • Security notifications cannot be completely disabled{'\n'}
            • Some critical notifications will be sent regardless of your settings{'\n'}
            • SMS notifications may incur charges from your mobile carrier{'\n'}
            • You can manage notification permissions in your device settings
          </Text>
        </View>
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
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationSettingsScreen;
