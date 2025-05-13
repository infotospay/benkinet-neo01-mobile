import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

// Define types
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  isActive: boolean;
}

export interface ExchangeRate {
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  timestamp: string;
}

export interface CurrencyPreference {
  defaultCurrency: string;
  displayCurrencies: string[];
}

interface CurrencyState {
  currencies: Currency[];
  exchangeRates: ExchangeRate[];
  currencyPreferences: CurrencyPreference;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: CurrencyState = {
  currencies: [],
  exchangeRates: [],
  currencyPreferences: {
    defaultCurrency: 'USD',
    displayCurrencies: ['USD', 'EUR', 'GBP', 'KES', 'UGX', 'TZS', 'RWF'],
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCurrencies = createAsyncThunk(
  'currency/fetchCurrencies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCurrencies();
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const fetchExchangeRates = createAsyncThunk(
  'currency/fetchExchangeRates',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getExchangeRates(params);
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const fetchLiveExchangeRates = createAsyncThunk(
  'currency/fetchLiveExchangeRates',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getLiveExchangeRates(params);
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const convertCurrency = createAsyncThunk(
  'currency/convertCurrency',
  async (data: { amount: number; fromCurrency: string; toCurrency: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.convertCurrency(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const fetchCurrencyPreferences = createAsyncThunk(
  'currency/fetchCurrencyPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCurrencyPreferences();
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const updateCurrencyPreferences = createAsyncThunk(
  'currency/updateCurrencyPreferences',
  async (data: CurrencyPreference, { rejectWithValue }) => {
    try {
      const response = await apiService.updateCurrencyPreferences(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Currency slice
const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setDefaultCurrency: (state, action: PayloadAction<string>) => {
      state.currencyPreferences.defaultCurrency = action.payload;
    },
    addDisplayCurrency: (state, action: PayloadAction<string>) => {
      if (!state.currencyPreferences.displayCurrencies.includes(action.payload)) {
        state.currencyPreferences.displayCurrencies.push(action.payload);
      }
    },
    removeDisplayCurrency: (state, action: PayloadAction<string>) => {
      state.currencyPreferences.displayCurrencies = state.currencyPreferences.displayCurrencies.filter(
        currency => currency !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // Fetch Currencies
    builder.addCase(fetchCurrencies.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrencies.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currencies = action.payload;
    });
    builder.addCase(fetchCurrencies.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Exchange Rates
    builder.addCase(fetchExchangeRates.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchExchangeRates.fulfilled, (state, action) => {
      state.isLoading = false;
      state.exchangeRates = action.payload;
    });
    builder.addCase(fetchExchangeRates.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Live Exchange Rates
    builder.addCase(fetchLiveExchangeRates.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLiveExchangeRates.fulfilled, (state, action) => {
      state.isLoading = false;
      state.exchangeRates = action.payload;
    });
    builder.addCase(fetchLiveExchangeRates.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Convert Currency
    builder.addCase(convertCurrency.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(convertCurrency.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(convertCurrency.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Currency Preferences
    builder.addCase(fetchCurrencyPreferences.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrencyPreferences.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currencyPreferences = action.payload;
    });
    builder.addCase(fetchCurrencyPreferences.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Update Currency Preferences
    builder.addCase(updateCurrencyPreferences.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCurrencyPreferences.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currencyPreferences = action.payload;
    });
    builder.addCase(updateCurrencyPreferences.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { 
  clearError, 
  setDefaultCurrency, 
  addDisplayCurrency, 
  removeDisplayCurrency 
} = currencySlice.actions;

export default currencySlice.reducer;
