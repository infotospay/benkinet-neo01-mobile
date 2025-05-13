import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { AUTH_CONFIG } from '../../config';
import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '../../api/apiConfig';

// Token storage using Keychain for secure storage
export const storeToken = async (token: string): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword('auth_token', token, {
      service: 'auth_token',
    });
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'auth_token',
    });
    
    if (credentials) {
      return credentials.password;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<boolean> => {
  try {
    await Keychain.resetGenericPassword({
      service: 'auth_token',
    });
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

// Refresh token storage and retrieval
export const storeRefreshToken = async (refreshToken: string): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword('refresh_token', refreshToken, {
      service: 'refresh_token',
    });
    return true;
  } catch (error) {
    console.error('Error storing refresh token:', error);
    return false;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'refresh_token',
    });
    
    if (credentials) {
      return credentials.password;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

// User data storage and retrieval
export const storeUser = async (user: any): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error storing user:', error);
    return false;
  }
};

export const getUser = async (): Promise<any | null> => {
  try {
    const userString = await AsyncStorage.getItem(AUTH_CONFIG.USER_KEY);
    
    if (userString) {
      return JSON.parse(userString);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(AUTH_CONFIG.USER_KEY);
    return true;
  } catch (error) {
    console.error('Error removing user:', error);
    return false;
  }
};

// Token refresh function
export const refreshToken = async (): Promise<string | null> => {
  try {
    const currentRefreshToken = await getRefreshToken();
    
    if (!currentRefreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${ENDPOINTS.REFRESH_TOKEN}`,
      { refreshToken: currentRefreshToken },
      { headers: API_CONFIG.HEADERS }
    );
    
    const { token, refreshToken: newRefreshToken } = response.data;
    
    // Store the new tokens
    await storeToken(token);
    await storeRefreshToken(newRefreshToken);
    
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    
    // Clear auth data on refresh failure
    await removeToken();
    await removeUser();
    
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};

// Logout function
export const logout = async (): Promise<boolean> => {
  try {
    await removeToken();
    await removeUser();
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

export default {
  storeToken,
  getToken,
  removeToken,
  storeRefreshToken,
  getRefreshToken,
  storeUser,
  getUser,
  removeUser,
  refreshToken,
  isAuthenticated,
  logout,
};
