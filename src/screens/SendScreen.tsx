import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useWalletStore } from '../store/walletStore';
import { isValidSolanaAddress } from '../utils/solana';

export default function SendScreen({ navigation }: any) {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    balance,
    solanaPrice,
    sendTransaction,
    refreshBalance,
    refreshPrice
  } = useWalletStore();

  useEffect(() => {
    refreshPrice();
  }, []);

  const usdValue = parseFloat(amount || '0') * solanaPrice;
  const isValidAmount = parseFloat(amount || '0') > 0 && parseFloat(amount || '0') <= balance;
  const isValidAddress = isValidSolanaAddress(toAddress);

  const handleSend = async () => {
    if (!isValidAddress) {
      Alert.alert('Ошибка', 'Неверный адрес получателя');
      return;
    }

    if (!isValidAmount) {
      Alert.alert('Ошибка', 'Неверная сумма');
      return;
    }

    Alert.alert(
      'Подтверждение',
      `Отправить ${amount} SOL на адрес ${toAddress.slice(0, 8)}...${toAddress.slice(-8)}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отправить',
          onPress: async () => {
            setLoading(true);
            try {
              const signature = await sendTransaction(toAddress, parseFloat(amount));
              Alert.alert(
                'Транзакция отправлена!',
                `Signature: ${signature.slice(0, 8)}...${signature.slice(-8)}`,
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось отправить транзакцию');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleMaxAmount = () => {
    const maxAmount = Math.max(0, balance - 0.001);
    setAmount(maxAmount.toString());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Назад</Text>
          </Pressable>
          <Text style={styles.title}>📤 Отправить SOL</Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Доступно для отправки</Text>
          <Text style={styles.balanceValue}>{balance.toFixed(4)} SOL</Text>
          {solanaPrice > 0 && (
            <Text style={styles.balanceUsd}>
              ≈ ${(balance * solanaPrice).toFixed(2)} USD
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Адрес получателя</Text>
          <TextInput
            style={[
              styles.textInput,
              styles.addressInput,
              !isValidAddress && toAddress.length > 0 && styles.invalidInput,
            ]}
            value={toAddress}
            onChangeText={setToAddress}
            placeholder="Введите адрес Solana кошелька"
            placeholderTextColor="#8892b0"
            multiline
          />
          {!isValidAddress && toAddress.length > 0 && (
            <Text style={styles.errorText}>Неверный адрес Solana</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.amountHeader}>
            <Text style={styles.inputLabel}>Сумма (SOL)</Text>
            <Pressable onPress={handleMaxAmount} style={styles.maxButton}>
              <Text style={styles.maxText}>Максимум</Text>
            </Pressable>
          </View>
          <TextInput
            style={[
              styles.textInput,
              styles.amountInput,
              !isValidAmount && amount.length > 0 && styles.invalidInput,
            ]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.0000"
            placeholderTextColor="#8892b0"
            keyboardType="numeric"
          />
          {amount && !isNaN(parseFloat(amount)) && solanaPrice > 0 && (
            <Text style={styles.usdText}>≈ ${usdValue.toFixed(2)} USD</Text>
          )}
          {!isValidAmount && amount.length > 0 && (
            <Text style={styles.errorText}>
              Недостаточно средств или неверная сумма
            </Text>
          )}
        </View>

        <View style={styles.feeContainer}>
          <Text style={styles.feeTitle}>💰 Информация о комиссии</Text>
          <Text style={styles.feeText}>
            • Комиссия сети: ~0.000005 SOL{'\n'}
            • Время подтверждения: 1-2 секунды{'\n'}
            • Сеть: Solana Devnet (тестовая)
          </Text>
        </View>

        <Pressable
          style={[
            styles.sendButton,
            (!isValidAddress || !isValidAmount || loading) && styles.disabledButton,
          ]}
          onPress={handleSend}
          disabled={!isValidAddress || !isValidAmount || loading}
        >
          <Text style={styles.sendButtonText}>
            {loading ? '⏳ Отправка...' : '📤 Отправить'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  scrollContainer: {
    paddingBottom: 40,
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
  balanceContainer: {
    backgroundColor: '#1a1a3a',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d5a',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8892b0',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 4,
  },
  balanceUsd: {
    fontSize: 16,
    color: '#64ffda',
  },
  inputContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: '#ccd6f6',
    marginBottom: 12,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#1a1a3a',
    borderWidth: 1,
    borderColor: '#2d2d5a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ccd6f6',
  },
  addressInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  amountInput: {
    fontSize: 20,
    textAlign: 'center',
  },
  invalidInput: {
    borderColor: '#ff4757',
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  maxButton: {
    backgroundColor: '#2d2d5a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  maxText: {
    color: '#64ffda',
    fontSize: 12,
    fontWeight: '600',
  },
  usdText: {
    fontSize: 14,
    color: '#8892b0',
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ff4757',
    marginTop: 4,
  },
  feeContainer: {
    backgroundColor: '#1a1a3a',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d2d5a',
  },
  feeTitle: {
    fontSize: 14,
    color: '#ccd6f6',
    fontWeight: '600',
    marginBottom: 8,
  },
  feeText: {
    fontSize: 12,
    color: '#8892b0',
    lineHeight: 18,
  },
  sendButton: {
    backgroundColor: '#00ff88',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#2d2d5a',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f0f23',
  },
});