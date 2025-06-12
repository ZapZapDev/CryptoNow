// global.ts - СОВРЕМЕННАЯ версия для React Native 0.73+
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// В React Native 0.73+ TextEncoder уже доступен глобально в Hermes!
// Больше НЕ НУЖНЫ полифиллы для: TextEncoder, TextDecoder, btoa, atob

// Убеждаемся что все готово для React Native
if (typeof global === 'undefined') {
  throw new Error('Global is not defined - это должна быть React Native среда');
}

// Простая проверка что мы в мобильной среде
console.log('🚀 CryptoNow - Мобильная версия загружена');
console.log('📱 Platform:', require('react-native').Platform.OS);

// Проверяем что современные API доступны
console.log('✅ TextEncoder доступен:', typeof TextEncoder !== 'undefined');
console.log('✅ btoa доступен:', typeof btoa !== 'undefined');

export {};