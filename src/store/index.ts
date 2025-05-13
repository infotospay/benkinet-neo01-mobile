import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import walletReducer from './slices/walletSlice';
import transactionReducer from './slices/transactionSlice';
import scheduledTransactionReducer from './slices/scheduledTransactionSlice';
import notificationReducer from './slices/notificationSlice';
import securityReducer from './slices/securitySlice';
import currencyReducer from './slices/currencySlice';
import roleReducer from './slices/roleSlice';
import paymentMethodReducer from './slices/paymentMethod';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    transaction: transactionReducer,
    scheduledTransaction: scheduledTransactionReducer,
    notification: notificationReducer,
    security: securityReducer,
    currency: currencyReducer,
    role: roleReducer,
    paymentMethod: paymentMethodReducer,
    // Other reducers will be added as they are created
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
