import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppSelector } from '../../store';

const SupportScreen = ({ navigation }: any) => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmitTicket = async () => {
    // Reset error
    setError(null);
    
    // Validate inputs
    if (!subject.trim()) {
      setError('Please enter a subject');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real implementation, you would call the API to submit the ticket
      // For this demo, we'll simulate a response
      setTimeout(() => {
        setIsLoading(false);
        
        Alert.alert(
          'Ticket Submitted',
          'Your support ticket has been submitted successfully. We will get back to you as soon as possible.',
          [
            {
              text: 'OK',
              onPress: () => {
                setSubject('');
                setMessage('');
              },
            },
          ]
        );
      }, 1500);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setError('Failed to submit ticket. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890');
  };
  
  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@benkinet.com');
  };
  
  const handleFAQ = () => {
    navigation.navigate('FAQ');
  };
  
  const handleViewTickets = () => {
    navigation.navigate('SupportTickets');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Support</Text>
        <Text style={styles.subtitle}>
          Get help with your account and transactions
        </Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Options</Text>
          
          <View style={styles.contactOptions}>
            <TouchableOpacity
              style={styles.contactOption}
              onPress={handleCallSupport}
            >
              <View style={styles.contactIconContainer}>
                <Text style={styles.contactIcon}>📞</Text>
              </View>
              <Text style={styles.contactOptionText}>Call Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.contactOption}
              onPress={handleEmailSupport}
            >
              <View style={styles.contactIconContainer}>
                <Text style={styles.contactIcon}>✉️</Text>
              </View>
              <Text style={styles.contactOptionText}>Email Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.contactOption}
              onPress={handleFAQ}
            >
              <View style={styles.contactIconContainer}>
                <Text style={styles.contactIcon}>❓</Text>
              </View>
              <Text style={styles.contactOptionText}>FAQ</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submit a Ticket</Text>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter subject"
              placeholderTextColor={colors.gray[400]}
              value={subject}
              onChangeText={setSubject}
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your issue or question"
              placeholderTextColor={colors.gray[400]}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!isLoading}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleSubmitTicket}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Submit Ticket</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.viewTicketsButton}
          onPress={handleViewTickets}
        >
          <Text style={styles.viewTicketsButtonText}>View My Tickets</Text>
        </TouchableOpacity>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Support Hours</Text>
          <Text style={styles.infoText}>
            Monday - Friday: 8:00 AM - 8:00 PM{'\n'}
            Saturday: 9:00 AM - 5:00 PM{'\n'}
            Sunday: Closed{'\n\n'}
            Emergency support is available 24/7 for urgent issues.
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
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  contactIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  contactIcon: {
    fontSize: 24,
  },
  contactOptionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.dark,
    textAlign: 'center',
  },
  formField: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  input: {
    height: 50,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  textArea: {
    height: 120,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.dark,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  disabledButton: {
    backgroundColor: colors.gray[400],
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
  },
  viewTicketsButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  viewTicketsButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
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

export default SupportScreen;
