import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useWalletStore } from '../store/walletStore';
import * as Clipboard from 'expo-clipboard';

export default function BackupScreen({ navigation }: any) {
  const [pinInput, setPinInput] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const { mnemonic } = useWalletStore();

  const handleVerifyPin = () => {
    if (pinInput.length >= 4) {
      setShowMnemonic(true);
      setPinInput('');
    } else {
      Alert.alert('Ошибка', 'PIN должен содержать минимум 4 цифры');
    }
  };

  const handleCopyMnemonic = async () => {
    if (!mnemonic) return;

    await Clipboard.setStringAsync(mnemonic);
    Alert.alert(
      '✅ Скопировано',
      'Фраза восстановления скопирована в буфер обмена.\n\nОбязательно сохраните её в безопасном месте!'
    );
  };

  const handleBack = () => {
    setShowMnemonic(false);
    setPinInput('');
    navigation.goBack();
  };

  if (!mnemonic) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Фраза восстановления не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← Назад</Text>
        </Pressable>
        <Text style={styles.title}>🔑 Фраза восстановления</Text>
      </View>

      {!showMnemonic ? (
        <View style={styles.content}>
          <Text style={styles.description}>
            Ваша секретная фраза из 12 слов
          </Text>

          <View style={styles.mnemonicContainer}>
            <Text style={styles.mnemonicTitle}>Фраза восстановления:</Text>
            <View style={styles.mnemonicBox}>
              <Text style={styles.mnemonicText}>{mnemonic}</Text>
            </View>
          </View>

          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>📝 Инструкции:</Text>
            <Text style={styles.instructionText}>
              1. Запишите эти слова в правильном порядке{'\n'}
              2. Храните запись в безопасном месте{'\n'}
              3. Никому не показывайте эту фразу{'\n'}
              4. Используйте для восстановления кошелька
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <Pressable style={styles.copyButton} onPress={handleCopyMnemonic}>
              <Text style={styles.copyButtonText}>📋 Копировать</Text>
            </Pressable>

            <Pressable style={styles.doneButton} onPress={handleBack}>
              <Text style={styles.doneButtonText}>✅ Готово</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const backupStyles = StyleSheet.create({
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
  errorText: {
    fontSize: 18,
    color: '#ff4757',
    textAlign: 'center',
    marginTop: 100,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  description: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
    marginBottom: 24,
  },
  warningContainer: {
    backgroundColor: '#2d1b1b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5a2d2d',
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 16,
    color: '#ff9999',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#ffcccc',
    lineHeight: 18,
  },
  pinInput: {
    backgroundColor: '#1a1a3a',
    borderWidth: 1,
    borderColor: '#2d2d5a',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#ccd6f6',
    textAlign: 'center',
    marginBottom: 24,
  },
  verifyButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#2d2d5a',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f0f23',
  },
  mnemonicContainer: {
    marginBottom: 24,
  },
  mnemonicTitle: {
    fontSize: 16,
    color: '#ccd6f6',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  mnemonicBox: {
    backgroundColor: '#1a1a3a',
    borderWidth: 1,
    borderColor: '#2d2d5a',
    borderRadius: 12,
    padding: 20,
  },
  mnemonicText: {
    fontSize: 16,
    color: '#00ff88',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  instructionContainer: {
    backgroundColor: '#1a1a3a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d2d5a',
    marginBottom: 24,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#2d2d5a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 14,
    color: '#64ffda',
    fontWeight: '600',
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#00ff88',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 14,
    color: '#0f0f23',
    fontWeight: 'bold',
  },
});