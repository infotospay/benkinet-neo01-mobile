import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '100';

const AboutScreen = ({ navigation }: any) => {
  const handleOpenWebsite = () => {
    Linking.openURL('https://benkinet.com');
  };
  
  const handleOpenPrivacyPolicy = () => {
    Linking.openURL('https://benkinet.com/privacy-policy');
  };
  
  const handleOpenTermsOfService = () => {
    Linking.openURL('https://benkinet.com/terms-of-service');
  };
  
  const handleOpenLicenses = () => {
    navigation.navigate('Licenses');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>B</Text>
          </View>
          <Text style={styles.appName}>Benkinet</Text>
          <Text style={styles.appVersion}>
            Version {APP_VERSION} (Build {BUILD_NUMBER})
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Benkinet</Text>
          <Text style={styles.sectionText}>
            Benkinet is a comprehensive financial platform that provides banking, payment, and remittance services across East Africa. Our mission is to make financial services accessible, affordable, and convenient for everyone.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>💳</Text>
              </View>
              <Text style={styles.featureTitle}>Multi-Currency Wallets</Text>
              <Text style={styles.featureDescription}>
                Manage multiple currencies in one place
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🔄</Text>
              </View>
              <Text style={styles.featureTitle}>Instant Transfers</Text>
              <Text style={styles.featureDescription}>
                Send money instantly to anyone
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🏦</Text>
              </View>
              <Text style={styles.featureTitle}>Bank Transfers</Text>
              <Text style={styles.featureDescription}>
                Connect with your bank accounts
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🔒</Text>
              </View>
              <Text style={styles.featureTitle}>Secure Payments</Text>
              <Text style={styles.featureDescription}>
                Industry-leading security standards
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleOpenPrivacyPolicy}
          >
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Text style={styles.menuItemIcon}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleOpenTermsOfService}
          >
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Text style={styles.menuItemIcon}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleOpenLicenses}
          >
            <Text style={styles.menuItemText}>Open Source Licenses</Text>
            <Text style={styles.menuItemIcon}>›</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.websiteButton}
          onPress={handleOpenWebsite}
        >
          <Text style={styles.websiteButtonText}>Visit Our Website</Text>
        </TouchableOpacity>
        
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Benkinet. All rights reserved.
        </Text>
      </ScrollView>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
  },
  appName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  appVersion: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
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
  sectionText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[700],
    lineHeight: typography.lineHeight.md,
  },
  featureList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.xs,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
    textAlign: 'center',
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
  websiteButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  websiteButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  copyright: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

export default AboutScreen;
