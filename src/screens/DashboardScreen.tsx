// src/screens/DashboardScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useWalletStore } from '../store/walletStore';
import { formatAddress } from '../utils/solana';

export default function DashboardScreen({ navigation }: any) {
  const {
    publicKey,
    balance,
    solanaPrice,
    isLoading,
    refreshBalance,
    refreshPrice,
    requestAirdrop,
    clearWallet,
  } = useWalletStore();

  useEffect(() => {
    // Загружаем данные при открытии
    refreshBalance();
    refreshPrice();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([
      refreshBalance(),
      refreshPrice(),
    ]);
  };

  const handleAirdrop = async () => {
    try {
      await requestAirdrop();
      Alert.alert(
        'Airdrop запрошен!',
        'Тестовые SOL будут начислены в течение нескольких секунд',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось получить airdrop');
    }
  };

  const handleSend = () => {
    Alert.alert('Send', 'Функция отправки будет добавлена позже');
  };

  const handleReceive = () => {
    Alert.alert('Receive', 'Функция получения будет добавлена позже');
  };

  const handleSettings = () => {
    Alert.alert(
      'Сброс кошелька',
      'Вы действительно хотите очистить кошелек? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            await clearWallet();
            navigation.navigate('Onboarding');
          },
        },
      ]
    );
  };

  const usdValue = balance * solanaPrice;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={handleRefresh}
          tintColor="#00ff88"
        />
      }
    >
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>🚀 CryptoNow</Text>
        <Pressable onPress={handleSettings} style={styles.settingsButton}>
          <Text style={styles.settingsText}>⚙️</Text>
        </Pressable>
      </View>

      {/* Баланс */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Общий баланс</Text>
        <Text style={styles.balanceValue}>
          {balance.toFixed(4)} SOL
        </Text>
        {solanaPrice > 0 && (
          <Text style={styles.balanceUsd}>
            ≈ ${usdValue.toFixed(2)} USD
          </Text>
        )}
        <Text style={styles.solPrice}>
          SOL: ${solanaPrice.toFixed(2)}
        </Text>
      </View>

      {/* Адрес кошелька */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Адрес кошелька</Text>
        <Text style={styles.addressValue}>
          {publicKey ? formatAddress(publicKey, 8) : 'Нет адреса'}
        </Text>
        <Text style={styles.networkLabel}>
          📍 Сеть: Solana Devnet (Тестовая)
        </Text>
      </View>

      {/* Действия */}
      <View style={styles.actionsContainer}>
        <Pressable style={styles.actionButton} onPress={handleSend}>
          <Text style={styles.actionEmoji}>📤</Text>
          <Text style={styles.actionText}>Отправить</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleReceive}>
          <Text style={styles.actionEmoji}>📥</Text>
          <Text style={styles.actionText}>Получить</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleAirdrop}>
          <Text style={styles.actionEmoji}>🎁</Text>
          <Text style={styles.actionText}>Airdrop</Text>
        </Pressable>
      </View>

      {/* Информация */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ Информация</Text>
        <Text style={styles.infoText}>
          • Это тестовая версия кошелька{'\n'}
          • Работает в Solana Devnet{'\n'}
          • Токены не имеют реальной стоимости{'\n'}
          • Используйте Airdrop для получения тестовых SOL
        </Text>
      </View>

      {/* Статистика */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>📊 Статистика</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Сеть:</Text>
          <Text style={styles.statValue}>Solana Devnet</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Версия:</Text>
          <Text style={styles.statValue}>1.0.0 Beta</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Статус:</Text>
          <Text style={[styles.statValue, { color: '#00ff88' }]}>
            ✅ Активен
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  settingsButton: {
    padding: 8,
  },
  settingsText: {
    fontSize: 24,
  },
  balanceContainer: {
    backgroundColor: '#1a1a3a',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d5a',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#8892b0',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 4,
  },
  balanceUsd: {
    fontSize: 18,
    color: '#64ffda',
    marginBottom: 8,
  },
  solPrice: {
    fontSize: 14,
    color: '#8892b0',
  },
  addressContainer: {
    backgroundColor: '#1a1a3a',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d5a',
  },
  addressLabel: {
    fontSize: 16,
    color: '#8892b0',
    marginBottom: 8,
  },
  addressValue: {
    fontSize: 18,
    color: '#ccd6f6',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  networkLabel: {
    fontSize: 14,
    color: '#64ffda',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#1a1a3a',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d5a',
    alignItems: 'center',
    minWidth: 80,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#ccd6f6',
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#1a1a3a',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d5a',
  },
  infoTitle: {
    fontSize: 18,
    color: '#ccd6f6',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#8892b0',
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: '#1a1a3a',
    marginHorizontal: 24,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d5a',
  },
  statsTitle: {
    fontSize: 18,
    color: '#ccd6f6',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#8892b0',
  },
  statValue: {
    fontSize: 14,
    color: '#ccd6f6',
    fontWeight: '600',
  },
});