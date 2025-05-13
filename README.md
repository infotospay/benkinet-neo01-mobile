# Benkinet Neo01 Mobile App

A comprehensive mobile application for the Benkinet Neo01 platform, providing banking, payment, and remittance services across East Africa.

## Features

- **Authentication**: Secure login, registration, and OTP verification
- **Wallet Management**: Create and manage multiple currency wallets
- **Transaction Processing**: Send and request money with fee calculation
- **QR Code Payments**: Generate and scan QR codes for payments
- **Payment Links**: Create and share payment links
- **Bank Transfers**: Link bank accounts, deposit, and withdraw funds
- **Transaction History**: View and filter transaction history
- **User Profile Management**: Edit profile, security settings, and language preferences
- **Notifications**: Receive and manage notifications for various events
- **Wallet Hierarchies**: Organize wallets into hierarchical groups with transfers between wallets
- **Scheduled Transactions**: Schedule one-time or recurring transactions
- **Enhanced Security**: Biometric authentication and transaction PIN
- **Multi-Currency Support**: Currency conversion and real-time exchange rates

## Technology Stack

- **Framework**: React Native
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **API Communication**: Axios
- **Authentication**: Secure token storage with Keychain
- **Styling**: Custom theme system

## Project Structure

```
benkinet-mobile/
├── src/
│   ├── api/                 # API service and configuration
│   ├── components/          # Reusable UI components
│   ├── config/              # App configuration
│   ├── navigation/          # Navigation structure
│   ├── screens/             # App screens organized by feature
│   ├── store/               # Redux store and slices
│   ├── theme/               # Theme configuration
│   └── utils/               # Utility functions
├── App.tsx                  # Main app component
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Implementation Status

The following features have been implemented:

1. ✅ Project Initialization
2. ✅ Project Structure Setup
3. ✅ API Configuration
4. ✅ Authentication Module
5. ✅ Navigation Structure
6. ✅ Wallet Management
7. ✅ Transaction Processing
8. ✅ QR Code Functionality
9. ✅ Payment Link Functionality
10. ✅ Bank Transfer Functionality
11. ✅ Transactions List and History
12. ✅ User Profile Management
13. ✅ Notifications and Alerts
14. ✅ Wallet Hierarchies
    - Create and manage wallet hierarchies
    - Organize wallets into hierarchical groups
    - Transfer funds between wallets in the same hierarchy
    - View hierarchy balances and statistics
15. ✅ Scheduled Transactions
    - Schedule one-time or recurring transactions
    - Daily, weekly, or monthly recurrence options
    - View, edit, and cancel scheduled transactions
    - Receive notifications for upcoming scheduled transactions
16. ✅ Enhanced Security Features
    - Biometric authentication (fingerprint/face)
    - Transaction PIN for sensitive operations
    - Device management and login history
    - Security alerts for suspicious activities
17. ✅ Multi-Currency Support
    - Currency conversion with real-time rates
    - View exchange rates for supported currencies
    - Set default currency and display preferences
    - Support for East African currencies (KES, UGX, TZS, RWF, etc.)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native CLI
- Android Studio or Xcode (for mobile development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/infotospay/benkinet-neo01-mobile.git
   cd benkinet-neo01-mobile
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

4. Run on Android or iOS:
   ```
   npm run android
   # or
   npm run ios
   ```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For more information, please contact [info@benkinet.com](mailto:info@benkinet.com).
