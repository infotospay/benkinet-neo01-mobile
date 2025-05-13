import { getToken, refreshToken, isAuthenticated, saveToken, clearToken } from './authUtils';

/**
 * Format a currency amount with the appropriate currency symbol
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., USD, EUR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if the currency is not supported
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Format a date string
 * @param dateString - The date string to format
 * @param format - The format to use ('short', 'medium', 'long')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  try {
    const date = new Date(dateString);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString();
      case 'medium':
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'long':
        return date.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      default:
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  } catch (error) {
    return dateString || 'Invalid date';
  }
};

export {
  getToken,
  refreshToken,
  isAuthenticated,
  saveToken,
  clearToken,
};
