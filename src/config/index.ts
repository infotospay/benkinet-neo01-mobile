export const APP_CONFIG = {
  APP_NAME: 'Benkinet Mobile',
  APP_VERSION: '0.0.1',
  API_URL: 'https://apigw.tospay.net/api/v1',
  API_TIMEOUT: 30000,
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'sw', 'fr'],
  ENVIRONMENT: 'development', // 'development', 'staging', 'production'
};

export const AUTH_CONFIG = {
  TOKEN_KEY: '@benkinet_auth_token',
  REFRESH_TOKEN_KEY: '@benkinet_refresh_token',
  USER_KEY: '@benkinet_user',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  BIOMETRIC_ENABLED_KEY: '@benkinet_biometric_enabled',
};

export const SECURITY_CONFIG = {
  CERTIFICATE_PINNING: {
    enabled: true,
    certs: [
      'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', // Replace with actual certificate fingerprint
    ],
  },
  JAILBREAK_DETECTION: true,
  SCREENSHOT_PROTECTION: true,
  SECURE_STORAGE: true,
};

export default {
  APP_CONFIG,
  AUTH_CONFIG,
  SECURITY_CONFIG,
};
