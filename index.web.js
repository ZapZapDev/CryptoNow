// index.web.js - ПРАВИЛЬНАЯ версия (JavaScript, не HTML!)
import { AppRegistry } from 'react-native';
import App from './App';

// Название приложения должно совпадать с именем проекта
const appName = 'CryptoNow';

// Регистрируем приложение для веба
AppRegistry.registerComponent(appName, () => App);

// Запускаем на веб-платформе
if (typeof document !== 'undefined') {
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('root'),
  });
}