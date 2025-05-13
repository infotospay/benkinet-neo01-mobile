import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

// Define types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SECURITY' | 'TRANSACTION';
  isRead: boolean;
  createdAt: string;
  data?: any;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  notificationSettings: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    securityAlertsEnabled: boolean;
    transactionAlertsEnabled: boolean;
    marketingEnabled: boolean;
  };
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  notificationSettings: {
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    securityAlertsEnabled: true,
    transactionAlertsEnabled: true,
    marketingEnabled: false,
  },
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getNotifications();
      return response.data || [];
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markNotificationAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.markNotificationAsRead(notificationId);
      return { id: notificationId, ...response.data };
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.markAllNotificationsAsRead();
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await apiService.deleteNotification(notificationId);
      return notificationId;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const fetchNotificationSettings = createAsyncThunk(
  'notification/fetchNotificationSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getNotificationSettings();
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notification/updateNotificationSettings',
  async (settings: any, { rejectWithValue }) => {
    try {
      const response = await apiService.updateNotificationSettings(settings);
      return response.data;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Notification slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch Notifications
    builder.addCase(fetchNotifications.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((notification: Notification) => !notification.isRead).length;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Mark Notification as Read
    builder.addCase(markNotificationAsRead.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.notifications.findIndex(notification => notification.id === action.payload.id);
      if (index !== -1) {
        const wasUnread = !state.notifications[index].isRead;
        state.notifications[index].isRead = true;
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    });
    builder.addCase(markNotificationAsRead.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Mark All Notifications as Read
    builder.addCase(markAllNotificationsAsRead.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
      state.isLoading = false;
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        isRead: true,
      }));
      state.unreadCount = 0;
    });
    builder.addCase(markAllNotificationsAsRead.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Delete Notification
    builder.addCase(deleteNotification.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.notifications.findIndex(notification => notification.id === action.payload);
      if (index !== -1) {
        const wasUnread = !state.notifications[index].isRead;
        state.notifications.splice(index, 1);
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    });
    builder.addCase(deleteNotification.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Notification Settings
    builder.addCase(fetchNotificationSettings.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchNotificationSettings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.notificationSettings = action.payload;
    });
    builder.addCase(fetchNotificationSettings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Update Notification Settings
    builder.addCase(updateNotificationSettings.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateNotificationSettings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.notificationSettings = action.payload;
    });
    builder.addCase(updateNotificationSettings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, addNotification, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
