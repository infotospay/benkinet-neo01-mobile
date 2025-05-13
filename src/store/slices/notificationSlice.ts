import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../api';
import { ErrorResponse } from '../../api/errorHandler';

// Define notification types
export enum NotificationType {
  TRANSACTION = 'TRANSACTION',
  SECURITY = 'SECURITY',
  SYSTEM = 'SYSTEM',
  MARKETING = 'MARKETING',
}

// Define notification priority
export enum NotificationPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

// Define notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

// Define notification settings interface
export interface NotificationSettings {
  transactionNotifications: boolean;
  securityNotifications: boolean;
  marketingNotifications: boolean;
  systemNotifications: boolean;
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
}

// Define notification state interface
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  isLoading: boolean;
  error: string | null;
}

// Define initial state
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  settings: {
    transactionNotifications: true,
    securityNotifications: true,
    marketingNotifications: false,
    systemNotifications: true,
    pushNotificationsEnabled: true,
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: false,
  },
  isLoading: false,
  error: null,
};

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // In a real implementation, this would call the API
      // const response = await apiService.get('/notifications');
      // return response.data;
      
      // For this demo, we'll return mock data
      return mockNotifications;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      // In a real implementation, this would call the API
      // const response = await apiService.put(`/notifications/${notificationId}/read`);
      // return response.data;
      
      // For this demo, we'll return the notification ID
      return notificationId;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      // In a real implementation, this would call the API
      // const response = await apiService.put('/notifications/read-all');
      // return response.data;
      
      // For this demo, we'll return success
      return true;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Update notification settings
export const updateNotificationSettings = createAsyncThunk(
  'notifications/updateNotificationSettings',
  async (settings: Partial<NotificationSettings>, { rejectWithValue }) => {
    try {
      // In a real implementation, this would call the API
      // const response = await apiService.put('/notifications/settings', settings);
      // return response.data;
      
      // For this demo, we'll return the settings
      return settings;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      return rejectWithValue(errorResponse.message);
    }
  }
);

// Create notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
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
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((notification: Notification) => !notification.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Mark notification as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount -= 1;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.isLoading = false;
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update notification settings
      .addCase(updateNotificationSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = {
          ...state.settings,
          ...action.payload,
        };
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Money Received',
    message: 'You have received $500 from John Doe',
    type: NotificationType.TRANSACTION,
    priority: NotificationPriority.HIGH,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    data: {
      transactionId: 'tx123',
      amount: 500,
      currency: 'USD',
      senderId: 'user456',
      senderName: 'John Doe',
    },
  },
  {
    id: '2',
    title: 'Security Alert',
    message: 'New login detected from an unknown device',
    type: NotificationType.SECURITY,
    priority: NotificationPriority.HIGH,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    data: {
      deviceInfo: 'iPhone 13, iOS 15.4',
      location: 'Nairobi, Kenya',
      ipAddress: '192.168.1.1',
    },
  },
  {
    id: '3',
    title: 'Payment Successful',
    message: 'Your payment of $25 to Acme Store was successful',
    type: NotificationType.TRANSACTION,
    priority: NotificationPriority.MEDIUM,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    data: {
      transactionId: 'tx456',
      amount: 25,
      currency: 'USD',
      merchantId: 'merchant123',
      merchantName: 'Acme Store',
    },
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Sunday, 2:00 AM - 4:00 AM',
    type: NotificationType.SYSTEM,
    priority: NotificationPriority.LOW,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    id: '5',
    title: 'Special Offer',
    message: 'Get 10% cashback on your next transaction',
    type: NotificationType.MARKETING,
    priority: NotificationPriority.LOW,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    data: {
      offerId: 'offer789',
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
    },
  },
  {
    id: '6',
    title: 'Low Balance Alert',
    message: 'Your wallet balance is below $50',
    type: NotificationType.TRANSACTION,
    priority: NotificationPriority.MEDIUM,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
    data: {
      walletId: 'wallet123',
      balance: 45.75,
      currency: 'USD',
    },
  },
  {
    id: '7',
    title: 'Password Changed',
    message: 'Your account password was recently changed',
    type: NotificationType.SECURITY,
    priority: NotificationPriority.HIGH,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: '8',
    title: 'New Feature Available',
    message: 'Try our new QR code payment feature',
    type: NotificationType.SYSTEM,
    priority: NotificationPriority.LOW,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
];

export const { addNotification, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
