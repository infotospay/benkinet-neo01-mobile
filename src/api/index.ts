import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, ENDPOINTS } from './apiConfig';
import { getToken, refreshToken } from '../utils/authUtils';
import { handleApiError, ErrorResponse } from './errorHandler';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    // Get token from secure storage
    const token = await getToken();
    
    // If token exists, add to headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(handleApiError(error));
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and not a retry, attempt token refresh
    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      
      try {
        // Attempt to refresh token
        const newToken = await refreshToken();
        
        // If successful, update the authorization header and retry
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, reject with original error
        return Promise.reject(handleApiError(error));
      }
    }
    
    // Handle other errors
    return Promise.reject(handleApiError(error));
  }
);

// API service methods with error handling
export const apiService = {
  // Authentication
  login: async (credentials: { email?: string; phone?: string; password: string }): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, credentials);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  register: async (userData: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  verifyOtp: async (data: { email?: string; phone?: string; otp: string }): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.VERIFY_OTP, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // Wallet
  getWallets: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.WALLETS);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getWalletDetails: async (walletId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.WALLET_DETAILS(walletId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  createWallet: async (walletData: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.WALLETS, walletData);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getWalletHierarchies: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.WALLET_HIERARCHIES);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // Transactions
  createTransaction: async (transactionData: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.TRANSACTIONS, transactionData);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getTransactions: async (params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.TRANSACTIONS, { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getTransactionDetails: async (transactionId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.TRANSACTION_DETAILS(transactionId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  calculateTransactionFee: async (data: { amount: number; currency: string; type: string }): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.TRANSACTION_FEE, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // QR Codes
  generateQrCode: async (data: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.QR_CODES_GENERATE, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  scanQrCode: async (data: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.QR_CODES_SCAN, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // Money Requests
  createMoneyRequest: async (requestData: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.MONEY_REQUESTS, requestData);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getIncomingMoneyRequests: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MONEY_REQUESTS_INCOMING);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // Configuration
  getCountries: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.COUNTRIES);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getCurrencies: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.CURRENCIES);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getExchangeRates: async (params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.EXCHANGE_RATES, { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
};

export default apiService;
