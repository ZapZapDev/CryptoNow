// src/store/walletStore.ts
import { create } from 'zustand';
import * as SolanaUtils from '../utils/solana';
import * as StorageUtils from '../utils/storage';

interface WalletState {
  // Состояние кошелька
  isWalletCreated: boolean;
  mnemonic: string | null;
  seed: string | null;
  publicKey: string | null;
  balance: number;
  solanaPrice: number;

  // Состояние UI
  isLoading: boolean;
  error: string | null;
  isPinSet: boolean;

  // Методы
  createWallet: () => Promise<void>;
  loadWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshPrice: () => Promise<void>;
  sendTransaction: (to: string, amount: number) => Promise<string>;
  requestAirdrop: () => Promise<void>;
  clearWallet: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  // Начальное состояние
  isWalletCreated: false,
  mnemonic: null,
  seed: null,
  publicKey: null,
  balance: 0,
  solanaPrice: 0,
  isLoading: false,
  error: null,
  isPinSet: false,

  // Создание нового кошелька
  createWallet: async () => {
    set({ isLoading: true, error: null });

    try {
      const mnemonic = await SolanaUtils.generateMnemonic();
      const seed = SolanaUtils.mnemonicToSeed(mnemonic);
      const account = SolanaUtils.accountFromSeed(seed);
      const publicKey = account.publicKey.toString();

      const walletData = {
        mnemonic,
        seed,
        publicKey,
        created: true,
      };

      await StorageUtils.saveWalletData(walletData);

      set({
        isWalletCreated: true,
        mnemonic,
        seed,
        publicKey,
        isLoading: false,
      });

      // Получаем начальный баланс
      await get().refreshBalance();
    } catch (error) {
      console.error('Ошибка создания кошелька:', error);
      set({
        error: 'Не удалось создать кошелек',
        isLoading: false
      });
    }
  },

  // Загрузка существующего кошелька
  loadWallet: async () => {
    set({ isLoading: true, error: null });

    try {
      const walletData = await StorageUtils.getWalletData();
      const isPinSet = await StorageUtils.isPinSet();

      if (walletData) {
        set({
          isWalletCreated: true,
          mnemonic: walletData.mnemonic,
          seed: walletData.seed,
          publicKey: walletData.publicKey,
          isPinSet,
          isLoading: false,
        });

        // Получаем актуальный баланс и цену
        await Promise.all([
          get().refreshBalance(),
          get().refreshPrice(),
        ]);
      } else {
        set({
          isWalletCreated: false,
          isPinSet,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки кошелька:', error);
      set({
        error: 'Не удалось загрузить кошелек',
        isLoading: false
      });
    }
  },

  // Обновление баланса
  refreshBalance: async () => {
    const { publicKey } = get();
    if (!publicKey) return;

    try {
      const balance = await SolanaUtils.getBalance(publicKey);
      set({ balance });
    } catch (error) {
      console.error('Ошибка обновления баланса:', error);
      set({ error: 'Не удалось обновить баланс' });
    }
  },

  // Обновление цены Solana
  refreshPrice: async () => {
    try {
      const solanaPrice = await SolanaUtils.getSolanaPrice();
      set({ solanaPrice });
    } catch (error) {
      console.error('Ошибка получения цены:', error);
      // Не показываем ошибку пользователю, это не критично
    }
  },

  // Отправка транзакции
  sendTransaction: async (to: string, amount: number): Promise<string> => {
    const { seed, publicKey } = get();
    if (!seed || !publicKey) {
      throw new Error('Кошелек не загружен');
    }

    set({ isLoading: true, error: null });

    try {
      const signature = await SolanaUtils.sendTransaction(
        seed,
        publicKey,
        to,
        amount
      );

      // Обновляем баланс после транзакции
      setTimeout(() => {
        get().refreshBalance();
      }, 2000);

      set({ isLoading: false });
      return signature;
    } catch (error) {
      console.error('Ошибка отправки транзакции:', error);
      set({
        error: 'Не удалось отправить транзакцию',
        isLoading: false
      });
      throw error;
    }
  },

  // Запрос Airdrop
  requestAirdrop: async () => {
    const { publicKey } = get();
    if (!publicKey) return;

    set({ isLoading: true, error: null });

    try {
      await SolanaUtils.requestAirdrop(publicKey);

      // Обновляем баланс через 3 секунды
      setTimeout(() => {
        get().refreshBalance();
      }, 3000);

      set({ isLoading: false });
    } catch (error) {
      console.error('Ошибка airdrop:', error);
      set({
        error: 'Не удалось получить airdrop',
        isLoading: false
      });
    }
  },

  // Очистка кошелька
  clearWallet: async () => {
    set({ isLoading: true });

    try {
      await StorageUtils.clearWalletData();
      set({
        isWalletCreated: false,
        mnemonic: null,
        seed: null,
        publicKey: null,
        balance: 0,
        isPinSet: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Ошибка очистки кошелька:', error);
      set({
        error: 'Не удалось очистить кошелек',
        isLoading: false
      });
    }
  },

  // Установка ошибки
  setError: (error: string | null) => {
    set({ error });
  },

  // Установка состояния загрузки
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));