// Payment method types

export enum PaymentMethodType {
  CARD = 'CARD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK = 'BANK',
  WALLET = 'WALLET',
  PAYPAL = 'PAYPAL',
  CRYPTO = 'CRYPTO',
}

export enum CardType {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
  DISCOVER = 'DISCOVER',
  DINERS = 'DINERS',
  JCB = 'JCB',
  UNIONPAY = 'UNIONPAY',
}

export enum MobileMoneyProvider {
  MPESA = 'MPESA',
  MTN = 'MTN',
  AIRTEL = 'AIRTEL',
  ORANGE = 'ORANGE',
  TIGO = 'TIGO',
  VODACOM = 'VODACOM',
  OTHER = 'OTHER',
}

export enum BankProvider {
  PESALINK = 'PESALINK',
  RTGS = 'RTGS',
  SWIFT = 'SWIFT',
  ACH = 'ACH',
  OTHER = 'OTHER',
}

export enum PaymentMethodStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  DELETED = 'DELETED',
}

// Base payment method interface
export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  status: PaymentMethodStatus;
  createdAt: string;
  updatedAt: string;
}

// Card payment method
export interface CardPaymentMethod extends PaymentMethod {
  type: PaymentMethodType.CARD;
  cardType: CardType;
  maskedCardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  billingAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

// Mobile money payment method
export interface MobileMoneyPaymentMethod extends PaymentMethod {
  type: PaymentMethodType.MOBILE_MONEY;
  provider: MobileMoneyProvider;
  accountHolderName: string;
  maskedPhoneNumber: string;
  countryCode: string;
}

// Bank payment method
export interface BankPaymentMethod extends PaymentMethod {
  type: PaymentMethodType.BANK;
  bankName: string;
  accountHolderName: string;
  maskedAccountNumber: string;
  branchCode?: string;
  swiftCode?: string;
  provider: BankProvider;
}

// Wallet payment method
export interface WalletPaymentMethod extends PaymentMethod {
  type: PaymentMethodType.WALLET;
  walletId: string;
  walletOwnerName: string;
  currency: string;
}

// PayPal payment method
export interface PayPalPaymentMethod extends PaymentMethod {
  type: PaymentMethodType.PAYPAL;
  email: string;
  accountHolderName: string;
}

// Crypto payment method
export interface CryptoPaymentMethod extends PaymentMethod {
  type: PaymentMethodType.CRYPTO;
  currency: string;
  walletAddress: string;
  network: string;
}

// Union type for all payment methods
export type AnyPaymentMethod =
  | CardPaymentMethod
  | MobileMoneyPaymentMethod
  | BankPaymentMethod
  | WalletPaymentMethod
  | PayPalPaymentMethod
  | CryptoPaymentMethod;

// Create payment method request types
export interface CreateCardPaymentMethodRequest {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  isDefault?: boolean;
  billingAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface CreateMobileMoneyPaymentMethodRequest {
  phoneNumber: string;
  accountHolderName: string;
  provider: MobileMoneyProvider;
  countryCode: string;
  isDefault?: boolean;
}

export interface CreateBankPaymentMethodRequest {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  branchCode?: string;
  swiftCode?: string;
  provider: BankProvider;
  isDefault?: boolean;
}

export interface CreatePayPalPaymentMethodRequest {
  email: string;
  accountHolderName: string;
  isDefault?: boolean;
}

export interface CreateCryptoPaymentMethodRequest {
  currency: string;
  walletAddress: string;
  network: string;
  isDefault?: boolean;
}

// Payment method state
export interface PaymentMethodState {
  paymentMethods: AnyPaymentMethod[];
  defaultPaymentMethod: AnyPaymentMethod | null;
  isLoading: boolean;
  error: string | null;
}
