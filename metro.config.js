const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Поддержка дополнительных расширений файлов
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db'
);

// Поддержка только мобильных платформ
config.resolver.platforms = ['native', 'android', 'ios'];

// В React Native 0.73+ многие полифиллы уже НЕ НУЖНЫ!
// TextEncoder, btoa, atob теперь доступны глобально в Hermes

// Минимальные настройки для Solana (только если нужно)
config.resolver.alias = {
  'crypto': 'expo-crypto',
  // Убрали: stream, buffer - не нужны для мобильных
};

// Поддержка больших файлов для Solana
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

// Оптимизация для продакшена
if (process.env.NODE_ENV === 'production') {
  config.transformer.minifierConfig.mangle = {
    keep_classnames: true,
    keep_fnames: true,
  };
}

module.exports = config;