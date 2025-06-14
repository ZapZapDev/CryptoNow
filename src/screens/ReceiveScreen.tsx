import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  Share,
} from 'react-native';
import { useWalletStore } from '../store/walletStore';
import { formatAddress } from '../utils/solana';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

export default function ReceiveScreen({ navigation }: any) {
  const { publicKey } = useWalletStore();

  const handleCopyAddress = async () => {
    if (!publicKey) return;

    await Clipboard.setStringAsync(publicKey);
    Alert.alert('✅ Скопировано', 'Адрес кошелька скопирован в буфер обмена');
  };

  const handleShareAddress = async () => {
    if (!publicKey) return;

    try {
      await Share.share({
        message: `Мой Solana кошелек: ${publicKey}`,
        title: 'Solana адрес',
      });
    } catch (error) {
      console.error('Ошибка при шаринге:', error);
    }
  };

  if (!publicKey) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Кошелек не найден</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Назад</Text>
        </Pressable>
        <Text style={styles.title}>📥 Получить SOL</Text>
      </View>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <View style={styles.qrWrapper}>
          <QRCode
            value={publicKey}
            size={200}
            backgroundColor="#ffffff"
            color="#000000"
          />
        </View>
        <Text style={styles.qrLabel}>QR код для получения платежей</Text>
      </View>

      {/* Адрес */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Ваш адрес кошелька</Text>
        <Text style={styles.addressShort}>
          {formatAddress(publicKey, 12)}
        </Text>
        <View style={styles.fullAddressContainer}>
          <Text style={styles.addressFull}>{publicKey}</Text>
        </View>
      </View>

      {/* Действия */}
      <View style={styles.actionsContainer}>
        <Pressable style={styles.actionButton} onPress={handleCopyAddress}>
          <Text style={styles.actionEmoji}>📋</Text>
          <Text style={styles.actionText}>Копировать адрес</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleShareAddress}>
          <Text style={styles.actionEmoji}>📤</Text>
          <Text style={styles.actionText}>Поделиться</Text>
        </Pressable>
      </View>

      {/* Инструкции */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionTitle}>📖 Как получить SOL</Text>
        <Text style={styles.instructionText}>
          1. Покажите QR код отправителю{'\n'}
          2. Или поделитесь адресом кошелька{'\n'}
          3. Отправитель сканирует код или копирует адрес{'\n'}
          4. SOL появится в вашем кошельке автоматически
        </Text>
      </View>

      {/* Предупреждение */}
      <View style={styles.warningContainer}>
        <Text style={styles.warningTitle}>⚠️ Важно</Text>
        <Text style={styles.warningText}>
          • Принимайте только SOL токены{'\n'}
          • Это тестовая сеть Devnet{'\n'}
          • Токены не имеют реальной стоимости{'\n'}
          • Для тестирования используйте Airdrop
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  errorText: {
    fontSize: 18,
    color: '#ff4757',
    textAlign: 'center',
    marginTop: 100,
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
  qrContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  qrWrapper: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  qrLabel: {
    fontSize: 14,
    color: '#8892b0',
    textAlign: 'center',
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
    color: '#ccd6f6',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addressShort: {
    fontSize: 18,
    color: '#00ff88',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  fullAddressContainer: {
    backgroundColor: '#0f0f23',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d2d5a',
  },
  addressFull: {
    fontSize: 12,
    color: '#8892b0',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1a1a3a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d2d5a',
    alignItems: 'center',
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
  instructionContainer: {
    backgroundColor: '#1a1a3a',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d5a',
  },
  instructionTitle: {
    fontSize: 16,
    color: '#ccd6f6',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#8892b0',
    lineHeight: 20,
  },
  warningContainer: {
    backgroundColor: '#2d1b1b',
    marginHorizontal: 24,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#5a2d2d',
  },
  warningTitle: {
    fontSize: 16,
    color: '#ff9999',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    color: '#ff9999',
    lineHeight: 20,
  },
});