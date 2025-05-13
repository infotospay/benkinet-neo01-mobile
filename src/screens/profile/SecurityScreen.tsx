import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateSecuritySettings } from '../../store/slices/authSlice';

const SecurityScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [transactionNotifications, setTransactionNotifications] = useState(true);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [securityUpdatesNotifications, setSecurityUpdatesNotifications] = useState(true);
  
  useEffect(() => {
    if (user && user.securitySettings) {
      setBiometricEnabled(user.securitySettings.biometricEnabled || false);
      setPinEnabled(user.securitySettings.pinEnabled || false);
      setTwoFactorEnabled(user.securitySettings.twoFactorEnabled || false);
      setTransactionNotifications(user.securitySettings.transactionNotifications !== false);
      setLoginNotifications(user.securitySettings.loginNotifications !== false);
      setSecurityUpdatesNotifications(user.securitySettings.securityUpdatesNotifications !== false);
    }
  }, [user]);
  
  const handleToggleBiometric = async (value: boolean) => {
    if (value) {
      // In a real app, this would trigger biometric setup
      Alert.alert(
        'Enable Biometric Authentication',
        'This feature is not implemented in the demo. In a real app, this would set up biometric authentication.',
        [
          { text: 'Cancel' },
          {
            text: 'Enable',
            onPress: () => {
              setBiometricEnabled(true);
              saveSecuritySettings({ biometricEnabled: true });
            },
          },
        ]
      );
    } else {
      setBiometricEnabled(false);
      saveSecuritySettings({ biometricEnabled: false });
    }
  };
  
  const handleTogglePin = async (value: boolean) => {
    if (value) {
      // In a real app, this would navigate to PIN setup screen
      navigation.navigate('SetupPIN');
    } else {
      setPinEnabled(false);
      saveSecuritySettings({ pinEnabled: false });
    }
  };
  
  const handleToggleTwoFactor = async (value: boolean) => {
    if (value) {
      // In a real app, this would navigate to 2FA setup screen
      navigation.navigate('Setup2FA');
    } else {
      setTwoFactorEnabled(false);
      saveSecuritySettings({ twoFactorEnabled: false });
    }
  };
  
  const handleToggleTransactionNotifications = (value: boolean) => {
    setTransactionNotifications(value);
    saveSecuritySettings({ transactionNotifications: value });
  };
  
  const handleToggleLoginNotifications = (value: boolean) => {
    setLoginNotifications(value);
    saveSecuritySettings({ loginNotifications: value });
  };
  
  const handleToggleSecurityUpdatesNotifications = (value: boolean) => {
    setSecurityUpdatesNotifications(value);
    saveSecuritySettings({ securityUpdatesNotifications: value });
  };
  
  const saveSecuritySettings = async (settings: any) => {
    try {
      const securitySettings = {
        biometricEnabled,
        pinEnabled,
        twoFactorEnabled,
        transactionNotifications,
        loginNotifications,
        securityUpdatesNotifications,
        ...settings,
      };
      
      await dispatch(updateSecuritySettings(securitySettings)).unwrap();
    } catch (error) {
      console.error('Error updating security settings:', error);
      Alert.alert('Error', 'Failed to update security settings. Please try again.');
    }
  };
  
  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };
  
  const handleDeviceManagement = () => {
    navigation.navigate('DeviceManagement');
  };
  
  const handleLoginHistory = () => {
    navigation.navigate('LoginHistory');
  };
  
  if (isLoading && !user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading security settings...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Security Settings</Text>
        <Text style={styles.subtitle}>
          Manage your account security and privacy
        </Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Biometric Authentication</Text>
              <Text style={styles.settingDescription}>
                Use fingerprint or face recognition to log in
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleToggleBiometric}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>PIN Authentication</Text>
              <Text style={styles.settingDescription}>
                Use a 6-digit PIN to log in
              </Text>
            </View>
            <Switch
              value={pinEnabled}
              onValueChange={handleTogglePin}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
              <Text style={styles.settingDescription}>
                Receive a verification code when logging in from a new device
              </Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={handleToggleTwoFactor}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Transaction Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications for all transactions
              </Text>
            </View>
            <Switch
              value={transactionNotifications}
              onValueChange={handleToggleTransactionNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Login Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications when your account is accessed
              </Text>
            </View>
            <Switch
              value={loginNotifications}
              onValueChange={handleToggleLoginNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Security Updates</Text>
              <Text style={styles.settingDescription}>
                Receive notifications about security updates and recommendations
              </Text>
            </View>
            <Switch
              value={securityUpdatesNotifications}
              onValueChange={handleToggleSecurityUpdatesNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device & Activity</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDeviceManagement}
          >
            <Text style={styles.menuItemText}>Device Management</Text>
            <Text style={styles.menuItemIcon}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLoginHistory}
          >
            <Text style={styles.menuItemText}>Login History</Text>
            <Text style={styles.menuItemIcon}>›</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Security Tips</Text>
          <Text style={styles.infoText}>
            • Use a strong, unique password{'\n'}
            • Enable two-factor authentication for extra security{'\n'}
            • Never share your login credentials with anyone{'\n'}
            • Be cautious of phishing attempts{'\n'}
            • Regularly check your account activity
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
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  menuItemText: {
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  menuItemIcon: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[500],
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

export default SecurityScreen;
