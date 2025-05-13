import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

// Define role types
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  MERCHANT = 'MERCHANT',
  AGENT = 'AGENT',
  SUPER_AGENT = 'SUPER_AGENT',
}

// Define types
export interface UserRoleInfo {
  role: UserRole;
  id: string;
  name: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  metadata?: any;
}

interface RoleState {
  availableRoles: UserRoleInfo[];
  activeRole: UserRoleInfo | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: RoleState = {
  availableRoles: [],
  activeRole: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserRoles = createAsyncThunk(
  'role/fetchUserRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserRoles();
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const switchUserRole = createAsyncThunk(
  'role/switchUserRole',
  async (roleId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.switchUserRole(roleId);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Role slice
const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActiveRole: (state, action: PayloadAction<UserRoleInfo>) => {
      state.activeRole = action.payload;
    },
    resetRoles: (state) => {
      state.availableRoles = [];
      state.activeRole = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch User Roles
    builder.addCase(fetchUserRoles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserRoles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.availableRoles = action.payload;
      
      // Set active role to the first available role if not already set
      if (!state.activeRole && action.payload.length > 0) {
        // Prioritize CUSTOMER role if available
        const customerRole = action.payload.find(role => role.role === UserRole.CUSTOMER);
        state.activeRole = customerRole || action.payload[0];
      }
    });
    builder.addCase(fetchUserRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Switch User Role
    builder.addCase(switchUserRole.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(switchUserRole.fulfilled, (state, action) => {
      state.isLoading = false;
      state.activeRole = action.payload;
    });
    builder.addCase(switchUserRole.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setActiveRole, resetRoles } = roleSlice.actions;

export default roleSlice.reducer;
