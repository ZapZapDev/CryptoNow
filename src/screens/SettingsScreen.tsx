import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import { useWalletStore } from '../store/walletStore';

export default function SettingsScreen({ navigation }: any) {
  const { clearWallet, publicKey, balance } = useWalletStore();

  const handleShowRecoveryPhrase = () => {
    navigation.navigate('BackupScreen');
  };

  const handleClearWallet = () => {
    Alert.alert(
      '🗑️ Очистить кошелек',
      'Вы действительно хотите удалить кошелек? Все данные будут потеряны навсегда!',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await clearWallet();
            navigation.navigate('Onboarding');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'О приложении',
      'CryptoNow v1.0.0\n\nSolana кошелек для мобильных устройств\n\nРазработан для тестирования в сети Devnet\n\n© 2024 ZapZapDev',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Назад</Text>
        </Pressable>
        <Text style={styles.title}>⚙️ Настройки</Text>
      </View>

      <View style={styles.walletInfo}>
        <Text style={styles.sectionTitle}>💼 Информация о кошельке</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Адрес:</Text>
          <Text style={styles.infoValue}>
            {publicKey ? `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}` : 'Нет'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Баланс:</Text>
          <Text style={styles.infoValue}>{balance.toFixed(4)} SOL</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Сеть:</Text>
          <Text style={[styles.infoValue, { color: '#00ff88' }]}>Devnet</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Безопасность</Text>
        <Pressable style={styles.settingItem} onPress={handleShowRecoveryPhrase}>
          <Text style={styles.settingEmoji}>🔑</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingText}>Фраза восстановления</Text>
            <Text style={styles.settingDescription}>
              Показать секретную фразу для восстановления кошелька
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧪 Тестирование</Text>
        <Pressable
          style={styles.settingItem}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.settingEmoji}>🎁</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingText}>Запросить Airdrop</Text>
            <Text style={styles.settingDescription}>
              Получить бесплатные тестовые SOL
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Информация</Text>
        <Pressable style={styles.settingItem} onPress={handleAbout}>
          <Text style={styles.settingEmoji}>📱</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingText}>О приложении</Text>
            <Text style={styles.settingDescription}>
              Версия, разработчик и лицензия
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      <View style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>⚠️ Опасная зона</Text>
        <Pressable style={styles.dangerItem} onPress={handleClearWallet}>
          <Text style={styles.settingEmoji}>🗑️</Text>
          <View style={styles.settingContent}>
            <Text style={[styles.settingText, { color: '#ff4757' }]}>
              Удалить кошелек
            </Text>
            <Text style={styles.settingDescription}>
              Полностью очистить все данные кошелька
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    color: '#00ff88',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ccd6f6',
    flex: 1,
  },
  walletInfo: {
    backgroundColor: '#1a1a3a',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d5a',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#ccd6f6',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8892b0',
  },
  infoValue: {
    fontSize: 14,
    color: '#ccd6f6',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  section: {
    backgroundColor: '#1a1a3a',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d5a',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d5a',
  },
  settingEmoji: {
    fontSize: 20,
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#ccd6f6',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#8892b0',
  },
  arrow: {
    fontSize: 18,
    color: '#8892b0',
  },
  dangerSection: {
    backgroundColor: '#2d1b1b',
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#5a2d2d',
    overflow: 'hidden',
  },
  dangerTitle: {
    fontSize: 18,
    color: '#ff9999',
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 0,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
});