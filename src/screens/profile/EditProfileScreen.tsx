import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateUserProfile } from '../../store/slices/authSlice';

const EditProfileScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setCountry(user.country || '');
      setProfileImage(user.profileImage || null);
    }
  }, [user]);
  
  const handleUpdateProfile = async () => {
    // Reset error
    setFormError(null);
    
    // Validate inputs
    if (!firstName.trim()) {
      setFormError('First name is required');
      return;
    }
    
    if (!lastName.trim()) {
      setFormError('Last name is required');
      return;
    }
    
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    
    if (!phone.trim()) {
      setFormError('Phone number is required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    // Validate phone format (simple validation)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      setFormError('Please enter a valid phone number');
      return;
    }
    
    try {
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
        profileImage,
      };
      
      await dispatch(updateUserProfile(profileData)).unwrap();
      
      Alert.alert(
        'Profile Updated',
        'Your profile has been successfully updated.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      setFormError('Failed to update profile. Please try again.');
    }
  };
  
  const handleSelectProfileImage = () => {
    // In a real implementation, this would open the image picker
    // For this demo, we'll just show an alert
    Alert.alert(
      'Select Profile Image',
      'This feature is not implemented in the demo. In a real app, this would open the image picker.',
      [{ text: 'OK' }]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>
            Update your personal information
          </Text>
          
          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {firstName && lastName
                    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                    : 'User'}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={handleSelectProfileImage}
            >
              <Text style={styles.changeImageButtonText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.form}>
            <View style={styles.formRow}>
              <View style={styles.formColumn}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter first name"
                  placeholderTextColor={colors.gray[400]}
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!isLoading}
                />
              </View>
              <View style={styles.formColumn}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter last name"
                  placeholderTextColor={colors.gray[400]}
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!isLoading}
                />
              </View>
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                placeholderTextColor={colors.gray[400]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor={colors.gray[400]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter address"
                placeholderTextColor={colors.gray[400]}
                value={address}
                onChangeText={setAddress}
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.formColumn}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter city"
                  placeholderTextColor={colors.gray[400]}
                  value={city}
                  onChangeText={setCity}
                  editable={!isLoading}
                />
              </View>
              <View style={styles.formColumn}>
                <Text style={styles.label}>Country</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter country"
                  placeholderTextColor={colors.gray[400]}
                  value={country}
                  onChangeText={setCountry}
                  editable={!isLoading}
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleUpdateProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
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
    backgroundColor: colors.light,
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileImagePlaceholderText: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
  },
  changeImageButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  changeImageButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  form: {
    marginBottom: spacing.xl,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  formColumn: {
    flex: 1,
    marginRight: spacing.sm,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
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
    marginTop: spacing.md,
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
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
});

export default EditProfileScreen;
