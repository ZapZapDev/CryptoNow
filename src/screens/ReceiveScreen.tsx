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
