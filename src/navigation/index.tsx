import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

// Import stacks
import AuthStack from './stacks/AuthStack';
import MainStack from './stacks/MainStack';

// Import auth utilities
import { isAuthenticated } from '../utils/authUtils';
import { RootState, useAppDispatch } from '../store';
import { fetchUserRoles } from '../store/slices/roleSlice';

// Define root navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const { isAuthenticated: isAuthenticatedRedux } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      
      // If authenticated, fetch user roles
      if (authenticated) {
        dispatch(fetchUserRoles());
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [isAuthenticatedRedux, dispatch]);

  if (isLoading) {
    // You could show a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
