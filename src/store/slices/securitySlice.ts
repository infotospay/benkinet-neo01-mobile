import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

// Define types
export interface Device {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  isCurrentDevice: boolean;
  ipAddress?: string;
  location?: string;
  osVersion?: string;
  appVersion?: string;
}

export interface LoginHistory {
  id: string;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  location?: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  failureReason?: string;
}

export interface BiometricStatus {
  isEnabled: boolean;
  type: 'FINGERPRINT' | 'FACE' | 'NONE';
  lastUpdated?: string;
}

export interface TransactionPINStatus {
  isEnabled: boolean;
  lastUpdated?: string;
}

interface SecurityState {
  devices: Device[];
  loginHistory: LoginHistory[];
  biometricStatus: BiometricStatus;
  transactionPINStatus: TransactionPINStatus;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: SecurityState = {
  devices: [],
  loginHistory: [],
  biometricStatus: {
    isEnabled: false,
    type: 'NONE',
  },
  transactionPINStatus: {
    isEnabled: false,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchDevices = createAsyncThunk(
  'security/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getDevices();
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const removeDevice = createAsyncThunk(
  'security/removeDevice',
  async (deviceId: string, { rejectWithValue }) => {
    try {
      await apiService.removeDevice(deviceId);
      return deviceId;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const fetchLoginHistory = createAsyncThunk(
  'security/fetchLoginHistory',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getLoginHistory(params);
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const setupBiometric = createAsyncThunk(
  'security/setupBiometric',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await apiService.setupBiometric(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const verifyBiometric = createAsyncThunk(
  'security/verifyBiometric',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyBiometric(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const setupTransactionPIN = createAsyncThunk(
  'security/setupTransactionPIN',
  async (data: { pin: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.setupTransactionPIN(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const verifyTransactionPIN = createAsyncThunk(
  'security/verifyTransactionPIN',
  async (data: { pin: string; transactionId?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyTransactionPIN(data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Security slice
const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setBiometricStatus: (state, action: PayloadAction<BiometricStatus>) => {
      state.biometricStatus = action.payload;
    },
    setTransactionPINStatus: (state, action: PayloadAction<TransactionPINStatus>) => {
      state.transactionPINStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Devices
    builder.addCase(fetchDevices.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchDevices.fulfilled, (state, action) => {
      state.isLoading = false;
      state.devices = action.payload;
    });
    builder.addCase(fetchDevices.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Remove Device
    builder.addCase(removeDevice.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeDevice.fulfilled, (state, action) => {
      state.isLoading = false;
      state.devices = state.devices.filter(device => device.id !== action.payload);
    });
    builder.addCase(removeDevice.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Login History
    builder.addCase(fetchLoginHistory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLoginHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.loginHistory = action.payload;
    });
    builder.addCase(fetchLoginHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Setup Biometric
    builder.addCase(setupBiometric.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(setupBiometric.fulfilled, (state, action) => {
      state.isLoading = false;
      state.biometricStatus = {
        isEnabled: true,
        type: action.payload.type || 'FINGERPRINT',
        lastUpdated: new Date().toISOString(),
      };
    });
    builder.addCase(setupBiometric.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Verify Biometric
    builder.addCase(verifyBiometric.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyBiometric.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(verifyBiometric.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Setup Transaction PIN
    builder.addCase(setupTransactionPIN.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(setupTransactionPIN.fulfilled, (state) => {
      state.isLoading = false;
      state.transactionPINStatus = {
        isEnabled: true,
        lastUpdated: new Date().toISOString(),
      };
    });
    builder.addCase(setupTransactionPIN.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Verify Transaction PIN
    builder.addCase(verifyTransactionPIN.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyTransactionPIN.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(verifyTransactionPIN.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setBiometricStatus, setTransactionPINStatus } = securitySlice.actions;

export default securitySlice.reducer;
