// src/types/index.ts

// Навигация
export type RootStackParamList = {
  Onboarding: undefined;
  SetPin: { mnemonic?: string };
  Dashboard: undefined;
  Send: undefined;
  Receive: undefined;
  Backup: undefined;
  BackupScreen: undefined;
  Settings: undefined;
  QRScanner?: { onScan: (data: string) => void };
};

// Данные кошелька
export interface WalletData {
  mnemonic: string;
  seed: string;
  publicKey: string;
  created: boolean;
}

// Транзакция
export interface TransactionData {
  signature: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

// Ошибки
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

// QR данные
export interface QRData {
  address: string;
  amount?: number;
  label?: string;
}

// Настройки приложения
export interface AppSettings {
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  currency: 'USD' | 'EUR' | 'RUB';
  language: 'en' | 'ru';
  theme: 'light' | 'dark';
}

// Статус сети
export interface NetworkStatus {
  isConnected: boolean;
  network: 'mainnet' | 'devnet' | 'testnet';
  rpcUrl: string;
}

// Информация о токене
export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

// Баланс токена
export interface TokenBalance {
  token: TokenInfo;
  balance: number;
  uiAmount: number;
  usdValue: number;
}