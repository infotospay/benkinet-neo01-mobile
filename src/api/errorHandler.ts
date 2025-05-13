import { AxiosError } from 'axios';

// Error types
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Error response structure
export interface ErrorResponse {
  type: ErrorType;
  message: string;
  status?: number;
  data?: any;
}

/**
 * Handle API errors and return standardized error response
 * @param error - The error from axios
 * @returns Standardized error response
 */
export const handleApiError = (error: AxiosError): ErrorResponse => {
  // Network error (no internet connection)
  if (error.message === 'Network Error') {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: 'Unable to connect to the server. Please check your internet connection.',
    };
  }

  // Timeout error
  if (error.code === 'ECONNABORTED') {
    return {
      type: ErrorType.TIMEOUT_ERROR,
      message: 'The request timed out. Please try again.',
    };
  }

  // Server responded with an error status
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        return {
          type: ErrorType.UNAUTHORIZED,
          message: 'You are not authorized to perform this action. Please log in again.',
          status,
          data,
        };

      case 403:
        return {
          type: ErrorType.FORBIDDEN,
          message: 'You do not have permission to access this resource.',
          status,
          data,
        };

      case 404:
        return {
          type: ErrorType.NOT_FOUND,
          message: 'The requested resource was not found.',
          status,
          data,
        };

      case 422:
        return {
          type: ErrorType.VALIDATION_ERROR,
          message: 'Validation failed. Please check your input.',
          status,
          data,
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ErrorType.SERVER_ERROR,
          message: 'A server error occurred. Please try again later.',
          status,
          data,
        };

      default:
        return {
          type: ErrorType.UNKNOWN_ERROR,
          message: data?.message || 'An unexpected error occurred.',
          status,
          data,
        };
    }
  }

  // Default error
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: error.message || 'An unexpected error occurred.',
  };
};

/**
 * Get user-friendly error message
 * @param error - The error response
 * @returns User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: ErrorResponse): string => {
  return error.message;
};

export default {
  handleApiError,
  getUserFriendlyErrorMessage,
  ErrorType,
};
