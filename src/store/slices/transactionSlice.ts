import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

// Define types
interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: 'CREDIT' | 'DEBIT';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description: string;
  sourceWalletId?: string;
  destinationWalletId?: string;
  recipientInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  pendingTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  pendingTransactions: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getTransactions(params);
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const fetchTransactionDetails = createAsyncThunk(
  'transaction/fetchTransactionDetails',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getTransactionDetails(transactionId);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (transactionData: any, { rejectWithValue }) => {
    try {
      const response = await apiService.createTransaction(transactionData);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const fetchPendingTransactions = createAsyncThunk(
  'transaction/fetchPendingTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getTransactions({ status: 'PENDING' });
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Transaction slice
const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedTransaction: (state, action: PayloadAction<Transaction>) => {
      state.selectedTransaction = action.payload;
    },
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Transactions
    builder.addCase(fetchTransactions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.transactions = action.payload;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Transaction Details
    builder.addCase(fetchTransactionDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactionDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedTransaction = action.payload;
    });
    builder.addCase(fetchTransactionDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Create Transaction
    builder.addCase(createTransaction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createTransaction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.transactions = [action.payload, ...state.transactions];
      
      // If the transaction is pending, add it to pending transactions
      if (action.payload.status === 'PENDING') {
        state.pendingTransactions = [action.payload, ...state.pendingTransactions];
      }
    });
    builder.addCase(createTransaction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Pending Transactions
    builder.addCase(fetchPendingTransactions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPendingTransactions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pendingTransactions = action.payload;
    });
    builder.addCase(fetchPendingTransactions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setSelectedTransaction, clearSelectedTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
