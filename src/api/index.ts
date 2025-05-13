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
  
  // Role Management
  getUserRoles: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.USER_ROLES);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  switchUserRole: async (roleId: string): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.SWITCH_ROLE, { roleId });
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
  
  getHierarchyDetails: async (hierarchyId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.HIERARCHY_DETAILS(hierarchyId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getHierarchyBalances: async (hierarchyId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.HIERARCHY_BALANCES(hierarchyId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  createWalletHierarchy: async (hierarchyData: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.WALLET_HIERARCHIES, hierarchyData);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  updateWalletHierarchy: async (hierarchyId: string, hierarchyData: any): Promise<any> => {
    try {
      const response = await api.put(ENDPOINTS.HIERARCHY_DETAILS(hierarchyId), hierarchyData);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  deleteWalletHierarchy: async (hierarchyId: string): Promise<any> => {
    try {
      const response = await api.delete(ENDPOINTS.HIERARCHY_DETAILS(hierarchyId));
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
  
  // Scheduled Transactions
  getScheduledTransactions: async (params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.SCHEDULED_TRANSACTIONS, { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getScheduledTransactionDetails: async (scheduledTransactionId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.SCHEDULED_TRANSACTION_DETAILS(scheduledTransactionId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  createScheduledTransaction: async (scheduledTransactionData: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.SCHEDULED_TRANSACTIONS, scheduledTransactionData);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  updateScheduledTransaction: async (scheduledTransactionId: string, data: any): Promise<any> => {
    try {
      const response = await api.put(ENDPOINTS.SCHEDULED_TRANSACTION_DETAILS(scheduledTransactionId), data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  cancelScheduledTransaction: async (scheduledTransactionId: string): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.SCHEDULED_TRANSACTION_CANCEL(scheduledTransactionId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // Enhanced Security
  setupBiometric: async (data: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.BIOMETRIC_SETUP, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  verifyBiometric: async (data: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.BIOMETRIC_VERIFY, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  setupTransactionPIN: async (data: { pin: string }): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.TRANSACTION_PIN_SETUP, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  verifyTransactionPIN: async (data: { pin: string; transactionId?: string }): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.TRANSACTION_PIN_VERIFY, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getDevices: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.DEVICES);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getDeviceDetails: async (deviceId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.DEVICE_DETAILS(deviceId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  removeDevice: async (deviceId: string): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.DEVICE_REMOVE(deviceId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getLoginHistory: async (params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.LOGIN_HISTORY, { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // Multi-Currency
  convertCurrency: async (data: { amount: number; fromCurrency: string; toCurrency: string }): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.CURRENCY_CONVERSION, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getLiveExchangeRates: async (params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.EXCHANGE_RATES_LIVE, { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getCurrencyPreferences: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.CURRENCY_PREFERENCES);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  updateCurrencyPreferences: async (data: any): Promise<any> => {
    try {
      const response = await api.put(ENDPOINTS.CURRENCY_PREFERENCES, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // Notifications
  getNotifications: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.NOTIFICATIONS);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  markNotificationAsRead: async (notificationId: string): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.NOTIFICATION_READ(notificationId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  markAllNotificationsAsRead: async (): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.NOTIFICATIONS_READ_ALL);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  deleteNotification: async (notificationId: string): Promise<any> => {
    try {
      const response = await api.delete(ENDPOINTS.NOTIFICATION_DELETE(notificationId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getNotificationSettings: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.NOTIFICATION_SETTINGS);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  updateNotificationSettings: async (settings: any): Promise<any> => {
    try {
      const response = await api.put(ENDPOINTS.NOTIFICATION_SETTINGS, settings);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // Merchant
  getMerchantProfile: async (merchantId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MERCHANT_PROFILE(merchantId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getMerchantTransactions: async (merchantId: string, params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MERCHANT_TRANSACTIONS(merchantId), { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getMerchantCommissions: async (merchantId: string, params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MERCHANT_COMMISSIONS(merchantId), { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getMerchantDualRoleSummary: async (merchantId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MERCHANT_DUAL_ROLE(merchantId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getMerchantPaymentMethods: async (merchantId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MERCHANT_PAYMENT_METHODS(merchantId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getMerchantPaymentLinks: async (merchantId: string, params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MERCHANT_PAYMENT_LINKS(merchantId), { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getMerchantQRCodes: async (merchantId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MERCHANT_QR_CODES(merchantId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getMerchantCustomers: async (merchantId: string, params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MERCHANT_CUSTOMERS(merchantId), { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getMerchantSettlements: async (merchantId: string, params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MERCHANT_SETTLEMENTS(merchantId), { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // Agent
  getAgentProfile: async (agentId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.AGENT_PROFILE(agentId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getAgentFloatAccounts: async (agentId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.AGENT_FLOAT_ACCOUNTS(agentId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  requestAgentFloat: async (data: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.AGENT_FLOAT_REQUEST, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  processCashCollection: async (data: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.AGENT_CASH_COLLECTIONS, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  processCashDistribution: async (data: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.AGENT_CASH_DISTRIBUTIONS, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getAgentCommissions: async (agentId: string, params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.AGENT_COMMISSIONS(agentId), { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getAgentCustomers: async (agentId: string, params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.AGENT_CUSTOMERS(agentId), { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getAgentTransactions: async (agentId: string, params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.AGENT_TRANSACTIONS(agentId), { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  // Super Agent
  getSuperAgentSubAgents: async (parentAgentId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.SUPER_AGENT_SUB_AGENTS(parentAgentId));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getSuperAgentFloatRequests: async (params?: any): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.SUPER_AGENT_FLOAT_REQUESTS, { params });
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  distributeSuperAgentFloat: async (data: any): Promise<any> => {
    try {
      const response = await api.post(ENDPOINTS.SUPER_AGENT_FLOAT_DISTRIBUTION, data);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getSuperAgentMarketLiquidity: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.SUPER_AGENT_MARKET_LIQUIDITY);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getSuperAgentCommissionStructure: async (parentAgentId: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.SUPER_AGENT_COMMISSION_STRUCTURE(parentAgentId));
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
  
  getBusinessCategories: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.BUSINESS_CATEGORIES);
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
  
  getMobileOperators: async (iso: string): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.MOBILE_OPERATORS(iso));
      return response.data;
    } catch (error) {
      throw error as ErrorResponse;
    }
  },
};

export default apiService;
