
// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ключи для хранения
const STORAGE_KEYS = {
  WALLET_CREATED: 'wallet_created',
  MNEMONIC: 'mnemonic',
  SEED: 'seed',
  PUBLIC_KEY: 'public_key',
  PIN_CODE: 'pin_code',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  FIRST_LAUNCH: 'first_launch',
} as const;

// Интерфейс данных кошелька
export interface WalletData {
  mnemonic: string;
  seed: string;
  publicKey: string;
  created: boolean;
}

// Сохранить данные кошелька
export const saveWalletData = async (walletData: WalletData): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.WALLET_CREATED, 'true'],
      [STORAGE_KEYS.MNEMONIC, walletData.mnemonic],
      [STORAGE_KEYS.SEED, walletData.seed],
      [STORAGE_KEYS.PUBLIC_KEY, walletData.publicKey],
    ]);
  } catch (error) {
    console.error('Ошибка сохранения кошелька:', error);
    throw new Error('Не удалось сохранить кошелек');
  }
};

// Получить данные кошелька
export const getWalletData = async (): Promise<WalletData | null> => {
  try {
    const data = await AsyncStorage.multiGet([
      STORAGE_KEYS.WALLET_CREATED,
      STORAGE_KEYS.MNEMONIC,
      STORAGE_KEYS.SEED,
      STORAGE_KEYS.PUBLIC_KEY,
    ]);

    const [created, mnemonic, seed, publicKey] = data.map(([, value]) => value);

    if (!created || !mnemonic || !seed || !publicKey) {
      return null;
    }

    return {
      mnemonic,
      seed,
      publicKey,
      created: created === 'true',
    };
  } catch (error) {
    console.error('Ошибка загрузки кошелька:', error);
    return null;
  }
};

// Проверить, создан ли кошелек
export const isWalletCreated = async (): Promise<boolean> => {
  try {
    const created = await AsyncStorage.getItem(STORAGE_KEYS.WALLET_CREATED);
    return created === 'true';
  } catch (error) {
    console.error('Ошибка проверки кошелька:', error);
    return false;
  }
};

// Сохранить PIN-код
export const savePinCode = async (pin: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PIN_CODE, pin);
  } catch (error) {
    console.error('Ошибка сохранения PIN:', error);
    throw new Error('Не удалось сохранить PIN-код');
  }
};

// Проверить PIN-код
export const verifyPinCode = async (pin: string): Promise<boolean> => {
  try {
    const savedPin = await AsyncStorage.getItem(STORAGE_KEYS.PIN_CODE);
    return savedPin === pin;
  } catch (error) {
    console.error('Ошибка проверки PIN:', error);
    return false;
  }
};

// Проверить, установлен ли PIN
export const isPinSet = async (): Promise<boolean> => {
  try {
    const pin = await AsyncStorage.getItem(STORAGE_KEYS.PIN_CODE);
    return pin !== null;
  } catch (error) {
    console.error('Ошибка проверки PIN:', error);
    return false;
  }
};

// Очистить все данные кошелька (для сброса)
export const clearWalletData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.WALLET_CREATED,
      STORAGE_KEYS.MNEMONIC,
      STORAGE_KEYS.SEED,
      STORAGE_KEYS.PUBLIC_KEY,
      STORAGE_KEYS.PIN_CODE,
    ]);
  } catch (error) {
    console.error('Ошибка очистки данных:', error);
    throw new Error('Не удалось очистить данные');
  }
};

// Сохранить состояние биометрии
export const setBiometricEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
  } catch (error) {
    console.error('Ошибка сохранения биометрии:', error);
  }
};

// Получить состояние биометрии
export const isBiometricEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
    return enabled === 'true';
  } catch (error) {
    console.error('Ошибка получения биометрии:', error);
    return false;
  }
};

// Проверить первый запуск
export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const firstLaunch = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
    if (firstLaunch === null) {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Ошибка проверки первого запуска:', error);
    return true;
  }
};