// src/screens/OnboardingScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useWalletStore } from '../store/walletStore';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }: any) {
  const [isCreating, setIsCreating] = useState(false);
  const { createWallet, error, setError } = useWalletStore();

  const handleCreateWallet = async () => {
    setIsCreating(true);
    setError(null);

    try {
      console.log('🚀 Начинаем создание кошелька...');
      await createWallet();
      console.log('✅ Кошелек успешно создан!');

      // Переходим к установке PIN-кода
      navigation.navigate('SetPin');
    } catch (error: any) {
      console.error('❌ Ошибка создания кошелька:', error);

      // Показываем детальную ошибку пользователю
      const errorMessage = error?.message || 'Неизвестная ошибка';

      Alert.alert(
        '❌ Ошибка создания кошелька',
        `Не удалось создать кошелек:\n\n${errorMessage}\n\nПопробуйте снова или перезапустите приложение.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleImportWallet = () => {
    Alert.alert(
      '📥 Импорт кошелька',
      'Функция импорта кошелька будет добавлена в следующих версиях.\n\nВы сможете восстановить кошелек используя seed-фразу.',
      [{ text: 'Понятно' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Логотип и заголовок */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🚀</Text>
        </View>
        <Text style={styles.title}>CryptoNow</Text>
        <Text style={styles.subtitle}>
          Делаем мир лучше
        </Text>
      </View>

      {/* Описание */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          Создайте свой первый Web3 кошелек и начните использовать экосистему Solana
        </Text>

        {/* Показываем ошибку если есть */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}
      </View>

      {/* Кнопки действий */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={[styles.primaryButton, isCreating && styles.buttonDisabled]}
          onPress={handleCreateWallet}
          disabled={isCreating}
        >
          {isCreating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#0f0f23" size="small" />
              <Text style={styles.loadingText}>Создаю кошелек...</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>🆕 Создать новый кошелек</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, isCreating && styles.buttonDisabled]}
          onPress={handleImportWallet}
          disabled={isCreating}
        >
          <Text style={styles.secondaryButtonText}>📥 Импортировать кошелек</Text>
        </Pressable>
      </View>

      {/* Важная информация */}
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>
          🔒 Ваши ключи хранятся только на устройстве{'\n'}
          🌐 Подключение к Solana Devnet (тестовая сеть){'\n'}
          ⚡ Бесплатные airdrop токены для тестирования
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64ffda',
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#00ff88',
    marginBottom: 16,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    borderColor: '#64ffda',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'transparent',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f0f23',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64ffda',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f0f23',
  },
  noteContainer: {
    backgroundColor: '#1a1a3a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d2d5a',
  },
  noteText: {
    fontSize: 14,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: 20,
  },
});