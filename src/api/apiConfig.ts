import { Platform } from 'react-native';
import { APP_CONFIG, SECURITY_CONFIG } from '../config';

export const API_CONFIG = {
  BASE_URL: APP_CONFIG.API_URL,
  TIMEOUT: APP_CONFIG.API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Platform': Platform.OS,
    'X-App-Version': APP_CONFIG.APP_VERSION,
  },
};

export const ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/user/login',
  REGISTER: '/auth/user/register',
  VERIFY_OTP: '/auth/user/verify-otp',
  REFRESH_TOKEN: '/auth/user/refresh',
  MERCHANT_LOGIN: '/auth/merchant/login',
  AGENT_LOGIN: '/auth/agent/login',
  
  // Role Management
  USER_ROLES: '/auth/user/roles',
  SWITCH_ROLE: '/auth/user/roles/switch',
  
  // Wallet
  WALLETS: '/wallet/wallets',
  WALLET_DETAILS: (walletId: string) => `/wallet/wallets/${walletId}`,
  WALLET_HIERARCHIES: '/wallet/wallet-hierarchies',
  HIERARCHY_DETAILS: (hierarchyId: string) => `/wallet/wallet-hierarchies/${hierarchyId}`,
  HIERARCHY_BALANCES: (hierarchyId: string) => `/wallet/wallet-hierarchies/${hierarchyId}/balances`,
  
  // Payment
  TRANSACTIONS: '/payment/transactions',
  TRANSACTION_DETAILS: (transactionId: string) => `/payment/transactions/${transactionId}`,
  TRANSACTION_FEE: '/payment/transactions/fee',
  QR_CODES_GENERATE: '/payment/qr-codes/generate',
  QR_CODES_SCAN: '/payment/qr-codes/scan',
  MONEY_REQUESTS: '/payment/money-requests',
  MONEY_REQUESTS_INCOMING: '/payment/money-requests/incoming',
  PAYMENT_LINKS: '/payment/payment-links',
  
  // Scheduled Transactions
  SCHEDULED_TRANSACTIONS: '/payment/scheduled-transactions',
  SCHEDULED_TRANSACTION_DETAILS: (scheduledTransactionId: string) => `/payment/scheduled-transactions/${scheduledTransactionId}`,
  SCHEDULED_TRANSACTION_CANCEL: (scheduledTransactionId: string) => `/payment/scheduled-transactions/${scheduledTransactionId}/cancel`,
  
  // Enhanced Security
  BIOMETRIC_SETUP: '/auth/user/biometric-setup',
  BIOMETRIC_VERIFY: '/auth/user/biometric-verify',
  TRANSACTION_PIN_SETUP: '/auth/user/transaction-pin-setup',
  TRANSACTION_PIN_VERIFY: '/auth/user/transaction-pin-verify',
  DEVICES: '/auth/user/devices',
  DEVICE_DETAILS: (deviceId: string) => `/auth/user/devices/${deviceId}`,
  DEVICE_REMOVE: (deviceId: string) => `/auth/user/devices/${deviceId}/remove`,
  LOGIN_HISTORY: '/auth/user/login-history',
  
  // Multi-Currency
  CURRENCY_CONVERSION: '/treasury/currency-conversion',
  EXCHANGE_RATES_LIVE: '/treasury/exchange-rates/live',
  CURRENCY_PREFERENCES: '/user/currency-preferences',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_DETAILS: (notificationId: string) => `/notifications/${notificationId}`,
  NOTIFICATION_READ: (notificationId: string) => `/notifications/${notificationId}/read`,
  NOTIFICATIONS_READ_ALL: '/notifications/read-all',
  NOTIFICATION_DELETE: (notificationId: string) => `/notifications/${notificationId}`,
  NOTIFICATION_SETTINGS: '/notifications/settings',
  
  // Merchant
  MERCHANT_PROFILE: (merchantId: string) => `/merchant/merchants/${merchantId}`,
  MERCHANT_TRANSACTIONS: (merchantId: string) => `/merchant/merchants/${merchantId}/transactions`,
  MERCHANT_COMMISSIONS: (merchantId: string) => `/merchant/merchants/${merchantId}/commissions`,
  MERCHANT_DUAL_ROLE: (merchantId: string) => `/merchant/merchants/${merchantId}/dual-role/summary`,
  MERCHANT_PAYMENT_METHODS: (merchantId: string) => `/merchant/merchants/${merchantId}/payment-methods`,
  MERCHANT_PAYMENT_LINKS: (merchantId: string) => `/merchant/merchants/${merchantId}/payment-links`,
  MERCHANT_QR_CODES: (merchantId: string) => `/merchant/merchants/${merchantId}/qr-codes`,
  MERCHANT_CUSTOMERS: (merchantId: string) => `/merchant/merchants/${merchantId}/customers`,
  MERCHANT_SETTLEMENTS: (merchantId: string) => `/merchant/merchants/${merchantId}/settlements`,
  
  // Agent
  AGENT_PROFILE: (agentId: string) => `/agent/agents/${agentId}`,
  AGENT_FLOAT_ACCOUNTS: (agentId: string) => `/agent/agents/${agentId}/float-accounts`,
  AGENT_FLOAT_REQUEST: '/agent/float-distributions/request',
  AGENT_CASH_COLLECTIONS: '/agent/cash-collections',
  AGENT_CASH_DISTRIBUTIONS: '/agent/cash-distributions',
  AGENT_COMMISSIONS: (agentId: string) => `/agent/agents/${agentId}/commissions`,
  AGENT_CUSTOMERS: (agentId: string) => `/agent/agents/${agentId}/customers`,
  AGENT_TRANSACTIONS: (agentId: string) => `/agent/agents/${agentId}/transactions`,
  
  // Super Agent
  SUPER_AGENT_SUB_AGENTS: (parentAgentId: string) => `/agent/agents?parentAgentId=${parentAgentId}`,
  SUPER_AGENT_FLOAT_REQUESTS: '/agent/float-distributions/requests',
  SUPER_AGENT_FLOAT_DISTRIBUTION: '/agent/float-distributions',
  SUPER_AGENT_MARKET_LIQUIDITY: '/agent/market-liquidity',
  SUPER_AGENT_COMMISSION_STRUCTURE: (parentAgentId: string) => `/agent/agents/${parentAgentId}/commission-structure`,
  
  // Treasury
  EXCHANGE_RATES: '/treasury/exchange-rates',
  FX_DEALS: '/treasury/fx-deals',
  TREASURY_ACCOUNTS: '/treasury/treasury-accounts',
  
  // Configuration
  COUNTRIES: '/config/countries',
  CURRENCIES: '/config/currencies',
  BUSINESS_CATEGORIES: '/config/business-categories',
  MOBILE_OPERATORS: (iso: string) => `/config/mobile-operators/${iso}`,
};

export const CERTIFICATE_PINNING = SECURITY_CONFIG.CERTIFICATE_PINNING;

export default {
  API_CONFIG,
  ENDPOINTS,
  CERTIFICATE_PINNING,
};
