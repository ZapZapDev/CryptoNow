import * as solanaWeb3 from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

const LAMPORTS_PER_SOL = solanaWeb3.LAMPORTS_PER_SOL;

// Создание подключения к Solana (devnet для разработки)
export const createConnection = () => {
  return new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl('devnet'),
    'confirmed'
  );
};

// Генерация мнемоники (исправленная версия)
export const generateMnemonic = async (): Promise<string> => {
  try {
    // Генерируем мнемонику на 12 слов
    const mnemonic = bip39.generateMnemonic(128); // 128 бит = 12 слов
    return mnemonic;
  } catch (error) {
    console.error('Ошибка генерации мнемоники:', error);
    throw new Error('Не удалось сгенерировать мнемонику');
  }
};

// Конвертация мнемоники в seed (исправленная версия)
export const mnemonicToSeed = (mnemonic: string): string => {
  try {
    // Проверяем валидность мнемоники
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Неверная мнемоника');
    }

    // Генерируем seed из мнемоники
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    return seed.toString('hex');
  } catch (error) {
    console.error('Ошибка конвертации мнемоники:', error);
    throw new Error('Неверная мнемоника');
  }
};

// Создание аккаунта из seed (исправленная версия)
export const accountFromSeed = (seedHex: string): solanaWeb3.Keypair => {
  try {
    // Конвертируем hex строку в Buffer
    const seed = Buffer.from(seedHex, 'hex');

    // Используем стандартный путь деривации для Solana: m/44'/501'/0'/0'
    const derivationPath = "m/44'/501'/0'/0'";
    const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;

    // Создаем keypair из derived seed
    return solanaWeb3.Keypair.fromSeed(derivedSeed);
  } catch (error) {
    console.error('Ошибка создания аккаунта:', error);
    throw new Error('Не удалось создать аккаунт');
  }
};

// Конвертация строки в PublicKey
export const publicKeyFromString = (publicKeyString: string): solanaWeb3.PublicKey => {
  try {
    return new solanaWeb3.PublicKey(publicKeyString);
  } catch (error) {
    console.error('Неверный публичный ключ:', error);
    throw new Error('Неверный адрес кошелька');
  }
};

// Получение баланса
export const getBalance = async (publicKey: string): Promise<number> => {
  try {
    const connection = createConnection();
    const _publicKey = publicKeyFromString(publicKey);
    const lamports = await connection.getBalance(_publicKey);
    return lamports / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Ошибка получения баланса:', error);
    return 0;
  }
};

// Отправка транзакции
export const sendTransaction = async (
  fromSeedHex: string,
  fromPublicKey: string,
  toPublicKey: string,
  amount: number
): Promise<string> => {
  try {
    const account = accountFromSeed(fromSeedHex);
    const connection = createConnection();

    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: publicKeyFromString(fromPublicKey),
        toPubkey: publicKeyFromString(toPublicKey),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await solanaWeb3.sendAndConfirmTransaction(
      connection,
      transaction,
      [account]
    );

    return signature;
  } catch (error) {
    console.error('Ошибка отправки транзакции:', error);
    throw new Error('Не удалось отправить транзакцию');
  }
};

// Запрос Airdrop (для devnet)
export const requestAirdrop = async (publicKeyString: string): Promise<string> => {
  try {
    const connection = createConnection();
    const airdropSignature = await connection.requestAirdrop(
      publicKeyFromString(publicKeyString),
      LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction(airdropSignature);
    return 'success';
  } catch (error) {
    console.error('Ошибка airdrop:', error);
    throw new Error('Не удалось получить airdrop');
  }
};

// Получение цены Solana
export const getSolanaPrice = async (): Promise<number> => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    );
    const data = await response.json();
    return data.solana.usd;
  } catch (error) {
    console.error('Ошибка получения цены:', error);
    return 0;
  }
};

// Валидация адреса Solana
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new solanaWeb3.PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Форматирование адреса для отображения
export const formatAddress = (address: string, chars: number = 4): string => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

// Валидация мнемоники
export const validateMnemonic = (mnemonic: string): boolean => {
  return bip39.validateMnemonic(mnemonic);
};