// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Добавляем поддержку .cjs файлов для некоторых пакетов
config.resolver.sourceExts.push('cjs');

// Добавляем алиасы для полифиллов (будет полезно позже для Solana)
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'crypto-browserify',
  stream: 'readable-stream',
  buffer: 'buffer',
};

module.exports = config;