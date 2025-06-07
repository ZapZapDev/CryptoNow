// global.ts
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// Полифилл для Buffer
global.Buffer = Buffer;

// Полифилл для процесса
if (typeof global.process === 'undefined') {
  global.process = { env: {} } as any;
}

// Полифилл для crypto (для веб)
if (typeof globalThis.crypto === 'undefined') {
  const { getRandomValues } = require('expo-crypto');
  globalThis.crypto = {
    getRandomValues,
  } as any;
}