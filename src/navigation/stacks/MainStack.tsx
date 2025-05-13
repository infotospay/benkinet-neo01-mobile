import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';

// Import screens and navigators
import MainTabNavigator from '../MainTabNavigator';
import { WalletDetailsScreen, CreateWalletScreen } from '../../screens/wallet';
import { 
  SendMoneyScreen, 
  RequestMoneyScreen, 
  TransactionDetailsScreen,
  TransactionsListScreen
} from '../../screens/transactions';
import {
  ScheduledTransactionsListScreen,
  ScheduledTransactionDetailsScreen,
  CreateScheduledTransactionScreen,
} from '../../screens/transactions/scheduled';
import { GenerateQRScreen, ScanQRScreen } from '../../screens/qrcode';
import { PaymentLinkScreen } from '../../screens/paymentlink';
import {
  BankTransferScreen,
  DepositFromBankScreen,
  WithdrawToBankScreen,
  LinkBankAccountScreen,
  ManageBankAccountsScreen,
} from '../../screens/banktransfer';
import {
  EditProfileScreen,
  SecurityScreen,
  SupportScreen,
  LanguageScreen,
  AboutScreen,
} from '../../screens/profile';
import {
  NotificationsListScreen,
  NotificationSettingsScreen,
} from '../../screens/notifications';
import { AgentDashboardScreen } from '../../screens/agent';
import { MerchantDashboardScreen } from '../../screens/merchant';
import { PaymentMethodsScreen } from '../../screens/payment';

// Define navigation types
export type MainStackParamList = {
  MainTab: undefined;
  SendMoney: { walletId?: string; amount?: string; recipientIdentifier?: string; description?: string; recipientName?: string };
  RequestMoney: { walletId?: string };
  ScanQR: undefined;
  GenerateQR: { walletId?: string };
  PaymentLink: { walletId?: string };
  BankTransfer: undefined;
  DepositFromBank: { walletId?: string };
  WithdrawToBank: { walletId?: string };
  LinkBankAccount: undefined;
  ManageBankAccounts: undefined;
  WalletDetails: { walletId: string };
  CreateWallet: undefined;
  Transactions: { walletId?: string };
  TransactionDetails: { transactionId: string };
  ScheduledTransactions: undefined;
  ScheduledTransactionDetails: { scheduledTransactionId: string };
  CreateScheduledTransaction: undefined;
  EditScheduledTransaction: { scheduledTransactionId: string };
  EditProfile: undefined;
  Security: undefined;
  Language: undefined;
  Support: undefined;
  About: undefined;
  ChangePassword: undefined;
  DeviceManagement: undefined;
  LoginHistory: undefined;
  Setup2FA: undefined;
  SetupPIN: undefined;
  FAQ: undefined;
  SupportTickets: undefined;
  Licenses: undefined;
  Notifications: undefined;
  NotificationSettings: undefined;
  BiometricSetup: undefined;
  TransactionPINSetup: undefined;
  CurrencyConversion: undefined;
  ExchangeRates: undefined;
  CurrencyPreferences: undefined;
  
  // Agent Screens
  AgentDashboard: undefined;
  CashIn: undefined;
  CashOut: undefined;
  FloatRequest: undefined;
  AgentTransactions: undefined;
  FloatAccounts: undefined;
  AgentCommissions: undefined;
  
  // Merchant Screens
  MerchantDashboard: undefined;
  CreatePaymentLink: undefined;
  MerchantTransactions: undefined;
  MerchantSettlements: undefined;
  MerchantCommissions: undefined;
  MerchantDualRole: undefined;
  
  // Payment Method Screens
  PaymentMethods: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTab"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTab" component={MainTabNavigator} />
      
      {/* Payment Screens */}
      <Stack.Screen 
        name="SendMoney" 
        component={SendMoneyScreen} 
        options={{ headerShown: true, title: 'Send Money' }}
      />
      <Stack.Screen 
        name="RequestMoney" 
        component={RequestMoneyScreen} 
        options={{ headerShown: true, title: 'Request Money' }}
      />
      <Stack.Screen 
        name="ScanQR" 
        component={ScanQRScreen} 
        options={{ headerShown: true, title: 'Scan QR Code', headerStyle: { backgroundColor: colors.dark }, headerTintColor: colors.white }}
      />
      <Stack.Screen 
        name="GenerateQR" 
        component={GenerateQRScreen} 
        options={{ headerShown: true, title: 'Generate QR Code' }}
      />
      <Stack.Screen 
        name="PaymentLink" 
        component={PaymentLinkScreen} 
        options={{ headerShown: true, title: 'Payment Link' }}
      />
      
      {/* Bank Transfer Screens */}
      <Stack.Screen 
        name="BankTransfer" 
        component={BankTransferScreen} 
        options={{ headerShown: true, title: 'Bank Transfer' }}
      />
      <Stack.Screen 
        name="DepositFromBank" 
        component={DepositFromBankScreen} 
        options={{ headerShown: true, title: 'Deposit from Bank' }}
      />
      <Stack.Screen 
        name="WithdrawToBank" 
        component={WithdrawToBankScreen} 
        options={{ headerShown: true, title: 'Withdraw to Bank' }}
      />
      <Stack.Screen 
        name="LinkBankAccount" 
        component={LinkBankAccountScreen} 
        options={{ headerShown: true, title: 'Link Bank Account' }}
      />
      <Stack.Screen 
        name="ManageBankAccounts" 
        component={ManageBankAccountsScreen} 
        options={{ headerShown: true, title: 'Manage Bank Accounts' }}
      />
      
      {/* Wallet Screens */}
      <Stack.Screen 
        name="WalletDetails" 
        component={WalletDetailsScreen} 
        options={{ headerShown: true, title: 'Wallet Details' }}
      />
      <Stack.Screen 
        name="CreateWallet" 
        component={CreateWalletScreen} 
        options={{ headerShown: true, title: 'Create Wallet' }}
      />
      <Stack.Screen 
        name="Transactions" 
        component={TransactionsListScreen} 
        options={{ headerShown: true, title: 'Transactions' }}
      />
      <Stack.Screen 
        name="TransactionDetails" 
        component={TransactionDetailsScreen} 
        options={{ headerShown: true, title: 'Transaction Details' }}
      />
      
      {/* Scheduled Transaction Screens */}
      <Stack.Screen 
        name="ScheduledTransactions" 
        component={ScheduledTransactionsListScreen} 
        options={{ headerShown: true, title: 'Scheduled Transactions' }}
      />
      <Stack.Screen 
        name="ScheduledTransactionDetails" 
        component={ScheduledTransactionDetailsScreen} 
        options={{ headerShown: true, title: 'Scheduled Transaction Details' }}
      />
      <Stack.Screen 
        name="CreateScheduledTransaction" 
        component={CreateScheduledTransactionScreen} 
        options={{ headerShown: true, title: 'Create Scheduled Transaction' }}
      />
      <Stack.Screen 
        name="EditScheduledTransaction" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Edit Scheduled Transaction' }}
      />
      
      {/* Profile Screens */}
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ headerShown: true, title: 'Edit Profile' }}
      />
      <Stack.Screen 
        name="Security" 
        component={SecurityScreen} 
        options={{ headerShown: true, title: 'Security' }}
      />
      <Stack.Screen 
        name="Language" 
        component={LanguageScreen} 
        options={{ headerShown: true, title: 'Language' }}
      />
      <Stack.Screen 
        name="Support" 
        component={SupportScreen} 
        options={{ headerShown: true, title: 'Support' }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ headerShown: true, title: 'About' }}
      />
      
      {/* Notification Screens */}
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsListScreen} 
        options={{ headerShown: true, title: 'Notifications' }}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen} 
        options={{ headerShown: true, title: 'Notification Settings' }}
      />
      
      {/* Security Screens */}
      <Stack.Screen 
        name="ChangePassword" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Change Password' }}
      />
      <Stack.Screen 
        name="DeviceManagement" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Device Management' }}
      />
      <Stack.Screen 
        name="LoginHistory" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Login History' }}
      />
      <Stack.Screen 
        name="Setup2FA" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Two-Factor Authentication' }}
      />
      <Stack.Screen 
        name="SetupPIN" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Set PIN' }}
      />
      
      {/* Enhanced Security Screens */}
      <Stack.Screen 
        name="BiometricSetup" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Biometric Authentication' }}
      />
      <Stack.Screen 
        name="TransactionPINSetup" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Transaction PIN' }}
      />
      
      {/* Multi-Currency Screens */}
      <Stack.Screen 
        name="CurrencyConversion" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Currency Conversion' }}
      />
      <Stack.Screen 
        name="ExchangeRates" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Exchange Rates' }}
      />
      <Stack.Screen 
        name="CurrencyPreferences" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Currency Preferences' }}
      />
      
      {/* Payment Method Screens */}
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen} 
        options={{ headerShown: true, title: 'Payment Methods' }}
      />
      
      {/* Agent Screens */}
      <Stack.Screen 
        name="AgentDashboard" 
        component={AgentDashboardScreen} 
        options={{ headerShown: true, title: 'Agent Dashboard' }}
      />
      <Stack.Screen 
        name="CashIn" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Cash In' }}
      />
      <Stack.Screen 
        name="CashOut" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Cash Out' }}
      />
      <Stack.Screen 
        name="FloatRequest" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Request Float' }}
      />
      <Stack.Screen 
        name="AgentTransactions" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Agent Transactions' }}
      />
      <Stack.Screen 
        name="FloatAccounts" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Float Accounts' }}
      />
      <Stack.Screen 
        name="AgentCommissions" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Agent Commissions' }}
      />
      
      {/* Merchant Screens */}
      <Stack.Screen 
        name="MerchantDashboard" 
        component={MerchantDashboardScreen} 
        options={{ headerShown: true, title: 'Merchant Dashboard' }}
      />
      <Stack.Screen 
        name="CreatePaymentLink" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Create Payment Link' }}
      />
      <Stack.Screen 
        name="MerchantTransactions" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Merchant Transactions' }}
      />
      <Stack.Screen 
        name="MerchantSettlements" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Merchant Settlements' }}
      />
      <Stack.Screen 
        name="MerchantCommissions" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Merchant Commissions' }}
      />
      <Stack.Screen 
        name="MerchantDualRole" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Dual Role Dashboard' }}
      />
      
      {/* Support Screens */}
      <Stack.Screen 
        name="FAQ" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Frequently Asked Questions' }}
      />
      <Stack.Screen 
        name="SupportTickets" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'My Support Tickets' }}
      />
      
      {/* About Screens */}
      <Stack.Screen 
        name="Licenses" 
        component={PlaceholderScreen} 
        options={{ headerShown: true, title: 'Open Source Licenses' }}
      />
    </Stack.Navigator>
  );
};

// Placeholder screen for screens that haven't been implemented yet
const PlaceholderScreen = ({ route, navigation }: any) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        {route.params?.title || route.name}
      </Text>
      <Text style={{ textAlign: 'center', marginBottom: 20 }}>
        This screen is under development and will be implemented soon.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: 'white', fontWeight: '500' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainStack;
