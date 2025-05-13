import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../../api';
import { ErrorResponse } from '../../../api/errorHandler';
import {
  PaymentMethodState,
  AnyPaymentMethod,
  CreateCardPaymentMethodRequest,
  CreateMobileMoneyPaymentMethodRequest,
  CreateBankPaymentMethodRequest,
  CreatePayPalPaymentMethodRequest,
  CreateCryptoPaymentMethodRequest,
} from './types';

// Initial state
const initialState: PaymentMethodState = {
  paymentMethods: [],
  defaultPaymentMethod: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPaymentMethods = createAsyncThunk(
  'paymentMethod/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPaymentMethods();
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const createCardPaymentMethod = createAsyncThunk(
  'paymentMethod/createCardPaymentMethod',
  async (data: CreateCardPaymentMethodRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.createCardPaymentMethod(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const createMobileMoneyPaymentMethod = createAsyncThunk(
  'paymentMethod/createMobileMoneyPaymentMethod',
  async (data: CreateMobileMoneyPaymentMethodRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.createMobileMoneyPaymentMethod(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const createBankPaymentMethod = createAsyncThunk(
  'paymentMethod/createBankPaymentMethod',
  async (data: CreateBankPaymentMethodRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.createBankPaymentMethod(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const createPayPalPaymentMethod = createAsyncThunk(
  'paymentMethod/createPayPalPaymentMethod',
  async (data: CreatePayPalPaymentMethodRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.createPayPalPaymentMethod(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const createCryptoPaymentMethod = createAsyncThunk(
  'paymentMethod/createCryptoPaymentMethod',
  async (data: CreateCryptoPaymentMethodRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.createCryptoPaymentMethod(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  'paymentMethod/deletePaymentMethod',
  async (paymentMethodId: string, { rejectWithValue }) => {
    try {
      await apiService.deletePaymentMethod(paymentMethodId);
      return paymentMethodId;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const setDefaultPaymentMethod = createAsyncThunk(
  'paymentMethod/setDefaultPaymentMethod',
  async (paymentMethodId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.setDefaultPaymentMethod(paymentMethodId);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Payment method slice
const paymentMethodSlice = createSlice({
  name: 'paymentMethod',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPaymentMethods: (state) => {
      state.paymentMethods = [];
      state.defaultPaymentMethod = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Payment Methods
    builder.addCase(fetchPaymentMethods.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPaymentMethods.fulfilled, (state, action) => {
      state.isLoading = false;
      state.paymentMethods = action.payload;
      state.defaultPaymentMethod = action.payload.find((method: AnyPaymentMethod) => method.isDefault) || null;
    });
    builder.addCase(fetchPaymentMethods.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Create Card Payment Method
    builder.addCase(createCardPaymentMethod.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createCardPaymentMethod.fulfilled, (state, action) => {
      state.isLoading = false;
      state.paymentMethods.push(action.payload);
      if (action.payload.isDefault) {
        state.defaultPaymentMethod = action.payload;
      }
    });
    builder.addCase(createCardPaymentMethod.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Create Mobile Money Payment Method
    builder.addCase(createMobileMoneyPaymentMethod.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createMobileMoneyPaymentMethod.fulfilled, (state, action) => {
      state.isLoading = false;
      state.paymentMethods.push(action.payload);
      if (action.payload.isDefault) {
        state.defaultPaymentMethod = action.payload;
      }
    });
    builder.addCase(createMobileMoneyPaymentMethod.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Create Bank Payment Method
    builder.addCase(createBankPaymentMethod.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createBankPaymentMethod.fulfilled, (state, action) => {
      state.isLoading = false;
      state.paymentMethods.push(action.payload);
      if (action.payload.isDefault) {
        state.defaultPaymentMethod = action.payload;
      }
    });
    builder.addCase(createBankPaymentMethod.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Create PayPal Payment Method
    builder.addCase(createPayPalPaymentMethod.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createPayPalPaymentMethod.fulfilled, (state, action) => {
      state.isLoading = false;
      state.paymentMethods.push(action.payload);
      if (action.payload.isDefault) {
        state.defaultPaymentMethod = action.payload;
      }
    });
    builder.addCase(createPayPalPaymentMethod.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Create Crypto Payment Method
    builder.addCase(createCryptoPaymentMethod.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createCryptoPaymentMethod.fulfilled, (state, action) => {
      state.isLoading = false;
      state.paymentMethods.push(action.payload);
      if (action.payload.isDefault) {
        state.defaultPaymentMethod = action.payload;
      }
    });
    builder.addCase(createCryptoPaymentMethod.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Delete Payment Method
    builder.addCase(deletePaymentMethod.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deletePaymentMethod.fulfilled, (state, action) => {
      state.isLoading = false;
      state.paymentMethods = state.paymentMethods.filter(
        (method) => method.id !== action.payload
      );
      if (state.defaultPaymentMethod && state.defaultPaymentMethod.id === action.payload) {
        state.defaultPaymentMethod = null;
      }
    });
    builder.addCase(deletePaymentMethod.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Set Default Payment Method
    builder.addCase(setDefaultPaymentMethod.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
      state.isLoading = false;
      // Update isDefault flag for all payment methods
      state.paymentMethods = state.paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === action.payload.id,
      }));
      state.defaultPaymentMethod = action.payload;
    });
    builder.addCase(setDefaultPaymentMethod.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, resetPaymentMethods } = paymentMethodSlice.actions;

export default paymentMethodSlice.reducer;
