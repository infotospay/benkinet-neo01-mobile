import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

// Define types
interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  isActive: boolean;
  type: string;
  [key: string]: any;
}

interface WalletHierarchy {
  id: string;
  name: string;
  wallets: Wallet[];
  [key: string]: any;
}

interface WalletState {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  hierarchies: WalletHierarchy[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: WalletState = {
  wallets: [],
  selectedWallet: null,
  hierarchies: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchWallets = createAsyncThunk(
  'wallet/fetchWallets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getWallets();
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const fetchWalletDetails = createAsyncThunk(
  'wallet/fetchWalletDetails',
  async (walletId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getWalletDetails(walletId);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const createWallet = createAsyncThunk(
  'wallet/createWallet',
  async (walletData: any, { rejectWithValue }) => {
    try {
      const response = await apiService.createWallet(walletData);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const fetchWalletHierarchies = createAsyncThunk(
  'wallet/fetchWalletHierarchies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getWalletHierarchies();
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Wallet slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedWallet: (state, action: PayloadAction<Wallet>) => {
      state.selectedWallet = action.payload;
    },
    clearSelectedWallet: (state) => {
      state.selectedWallet = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Wallets
    builder.addCase(fetchWallets.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchWallets.fulfilled, (state, action) => {
      state.isLoading = false;
      state.wallets = action.payload;
    });
    builder.addCase(fetchWallets.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Wallet Details
    builder.addCase(fetchWalletDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchWalletDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedWallet = action.payload;
    });
    builder.addCase(fetchWalletDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Create Wallet
    builder.addCase(createWallet.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createWallet.fulfilled, (state, action) => {
      state.isLoading = false;
      state.wallets = [...state.wallets, action.payload];
    });
    builder.addCase(createWallet.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Wallet Hierarchies
    builder.addCase(fetchWalletHierarchies.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchWalletHierarchies.fulfilled, (state, action) => {
      state.isLoading = false;
      state.hierarchies = action.payload;
    });
    builder.addCase(fetchWalletHierarchies.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setSelectedWallet, clearSelectedWallet } = walletSlice.actions;

export default walletSlice.reducer;
