import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Полифилл для текстового кодирования (для Solana)
import 'text-encoding-polyfill';

// Убеждаемся что все готово для React Native
if (typeof global === 'undefined') {
  throw new Error('Global is not defined - это должна быть React Native среда');
}

// Простая проверка что мы в мобильной среде
console.log('🚀 CryptoNow - Мобильная версия загружена');
console.log('📱 Platform:', require('react-native').Platform.OS);

export {};