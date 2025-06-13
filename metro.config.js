const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Поддержка дополнительных расширений файлов
config.resolver.assetExts.push('db');

// Поддержка только мобильных платформ
config.resolver.platforms = ['native', 'android', 'ios'];

// Минимальные алиасы для React Native 0.79+ и Hermes
config.resolver.alias = {
  'crypto': 'expo-crypto',
};

// Настройки трансформации для лучшей производительности
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

// Исключаем ненужные файлы из обработки
config.resolver.blockList = [
  /.*\/__tests__\/.*/,
  /.*\.test\.[jt]sx?$/,
  /.*\.spec\.[jt]sx?$/,
];

module.exports = config;