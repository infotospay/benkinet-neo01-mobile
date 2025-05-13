import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, StatusBar } from 'react-native';
import { colors, spacing, typography } from '../theme';
// import Button from '../components/Button';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* Replace with actual logo */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>Benkinet</Text>
          </View>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to Benkinet</Text>
          <Text style={styles.subtitle}>
            Your all-in-one financial solution for payments, banking, and remittances
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          {/* Will use Button component once it's properly set up */}
          <View style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </View>
          
          <View style={[styles.button, styles.outlineButton]}>
            <Text style={styles.outlineButtonText}>I already have an account</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: typography.lineHeight.md,
  },
  buttonContainer: {
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  outlineButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
