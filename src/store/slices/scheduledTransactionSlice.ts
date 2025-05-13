import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

// Define types
export enum RecurrenceType {
  ONCE = 'ONCE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface ScheduledTransaction {
  id: string;
  amount: number;
  currency: string;
  sourceWalletId: string;
  destinationWalletId?: string;
  recipientInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  description: string;
  scheduledDate: string;
  recurrenceType: RecurrenceType;
  recurrenceEndDate?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface ScheduledTransactionState {
  scheduledTransactions: ScheduledTransaction[];
  selectedScheduledTransaction: ScheduledTransaction | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ScheduledTransactionState = {
  scheduledTransactions: [],
  selectedScheduledTransaction: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchScheduledTransactions = createAsyncThunk(
  'scheduledTransaction/fetchScheduledTransactions',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getScheduledTransactions(params);
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const fetchScheduledTransactionDetails = createAsyncThunk(
  'scheduledTransaction/fetchScheduledTransactionDetails',
  async (scheduledTransactionId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getScheduledTransactionDetails(scheduledTransactionId);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const createScheduledTransaction = createAsyncThunk(
  'scheduledTransaction/createScheduledTransaction',
  async (scheduledTransactionData: any, { rejectWithValue }) => {
    try {
      const response = await apiService.createScheduledTransaction(scheduledTransactionData);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const updateScheduledTransaction = createAsyncThunk(
  'scheduledTransaction/updateScheduledTransaction',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateScheduledTransaction(id, data);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const cancelScheduledTransaction = createAsyncThunk(
  'scheduledTransaction/cancelScheduledTransaction',
  async (scheduledTransactionId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.cancelScheduledTransaction(scheduledTransactionId);
      return { id: scheduledTransactionId, ...response.data };
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Scheduled Transaction slice
const scheduledTransactionSlice = createSlice({
  name: 'scheduledTransaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedScheduledTransaction: (state, action: PayloadAction<ScheduledTransaction>) => {
      state.selectedScheduledTransaction = action.payload;
    },
    clearSelectedScheduledTransaction: (state) => {
      state.selectedScheduledTransaction = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Scheduled Transactions
    builder.addCase(fetchScheduledTransactions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchScheduledTransactions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.scheduledTransactions = action.payload;
    });
    builder.addCase(fetchScheduledTransactions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Scheduled Transaction Details
    builder.addCase(fetchScheduledTransactionDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchScheduledTransactionDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedScheduledTransaction = action.payload;
    });
    builder.addCase(fetchScheduledTransactionDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Create Scheduled Transaction
    builder.addCase(createScheduledTransaction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createScheduledTransaction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.scheduledTransactions = [action.payload, ...state.scheduledTransactions];
    });
    builder.addCase(createScheduledTransaction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Update Scheduled Transaction
    builder.addCase(updateScheduledTransaction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateScheduledTransaction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.scheduledTransactions = state.scheduledTransactions.map(transaction => 
        transaction.id === action.payload.id ? action.payload : transaction
      );
      if (state.selectedScheduledTransaction?.id === action.payload.id) {
        state.selectedScheduledTransaction = action.payload;
      }
    });
    builder.addCase(updateScheduledTransaction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Cancel Scheduled Transaction
    builder.addCase(cancelScheduledTransaction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(cancelScheduledTransaction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.scheduledTransactions = state.scheduledTransactions.map(transaction => 
        transaction.id === action.payload.id ? { ...transaction, status: 'CANCELLED' } : transaction
      );
      if (state.selectedScheduledTransaction?.id === action.payload.id) {
        state.selectedScheduledTransaction = { ...state.selectedScheduledTransaction, status: 'CANCELLED' };
      }
    });
    builder.addCase(cancelScheduledTransaction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { 
  clearError, 
  setSelectedScheduledTransaction, 
  clearSelectedScheduledTransaction 
} = scheduledTransactionSlice.actions;

export default scheduledTransactionSlice.reducer;
