const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Поддержка дополнительных расширений файлов
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db'
);

// Поддержка Solana и крипто библиотек
config.resolver.platforms = ['native', 'android', 'ios'];

// Исключаем веб-платформы
config.resolver.platforms = config.resolver.platforms.filter(
  platform => platform !== 'web'
);

// Настройки для крипто библиотек
config.resolver.alias = {
  'crypto': 'expo-crypto',
  'stream': 'stream-browserify',
  'buffer': '@craftzdog/react-native-buffer',
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

module.exports = config;onfig;