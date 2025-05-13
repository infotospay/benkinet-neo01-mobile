import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import WelcomeScreen from '../../screens/WelcomeScreen';
import { LoginScreen, RegisterScreen, VerifyOtpScreen } from '../../screens/auth';

// Define navigation types
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  VerifyOtp: { identifier: string; isEmail: boolean };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
