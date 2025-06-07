// src/screens/SetPinScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Vibration,
} from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { savePinCode } from '../utils/storage';

export default function SetPinScreen({ navigation }: any) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [isLoading, setIsLoading] = useState(false);

  const handleNumberPress = (number: string) => {
    // Тактильная обратная связь
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Fallback для устройств без haptics
      Vibration.vibrate(10);
    }

    if (step === 'create' && pin.length < 4) {
      setPin(prev => prev + number);
    } else if (step === 'confirm' && confirmPin.length < 4) {
      setConfirmPin(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    if (step === 'create') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const handleContinue = () => {
    if (pin.length === 4) {
      setStep('confirm');
    }
  };

  const handleSavePin = async () => {
    if (pin === confirmPin) {
      setIsLoading(true);
      try {
        await savePinCode(pin);
        navigation.navigate('Dashboard');
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось сохранить PIN-код');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        'PIN-коды не совпадают',
        'Попробуйте ввести PIN-код заново',
        [
          {
            text: 'OK',
            onPress: () => {
              setConfirmPin('');
              setStep('create');
              setPin('');
            },
          },
        ]
      );
    }
  };

  React.useEffect(() => {
    if (step === 'create' && pin.length === 4) {
      // Автоматически переходим к подтверждению
      setTimeout(handleContinue, 300);
    } else if (step === 'confirm' && confirmPin.length === 4) {
      // Автоматически сохраняем PIN
      setTimeout(handleSavePin, 300);
    }
  }, [pin, confirmPin, step]);

  const currentPin = step === 'create' ? pin : confirmPin;

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {step === 'create' ? 'Создать PIN-код' : 'Подтвердить PIN-код'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'create'
            ? 'Создайте 4-значный PIN-код для защиты кошелька'
            : 'Введите PIN-код еще раз для подтверждения'
          }
        </Text>
      </View>

      {/* Отображение PIN */}
      <View style={styles.pinDisplay}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              currentPin.length > index && styles.pinDotFilled,
            ]}
          />
        ))}
      </View>

      {/* Цифровая клавиатура */}
      <View style={styles.keypad}>
        {/* Ряды цифр */}
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['', '0', 'backspace'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, keyIndex) => (
              <View key={keyIndex} style={styles.keyContainer}>
                {key === '' ? (
                  <View style={styles.keyEmpty} />
                ) : key === 'backspace' ? (
                  <Button
                    onPress={handleBackspace}
                    style={styles.keyBackspace}
                    contentStyle={styles.keyBackspaceContent}
                    disabled={currentPin.length === 0}
                  >
                    <Text style={styles.keyBackspaceText}>⌫</Text>
                  </Button>
                ) : (
                  <Button
                    onPress={() => handleNumberPress(key)}
                    style={styles.key}
                    contentStyle={styles.keyContent}
                    disabled={currentPin.length >= 4}
                  >
                    <Text style={styles.keyText}>{key}</Text>
                  </Button>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Загрузка */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff88" />
          <Text style={styles.loadingText}>Сохранение PIN-кода...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2d2d5a',
    marginHorizontal: 12,
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: '#00ff88',
    borderColor: '#00ff88',
  },
  keypad: {
    flex: 1,
    maxHeight: 400,
    justifyContent: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  keyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  key: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1a1a3a',
    borderWidth: 1,
    borderColor: '#2d2d5a',
  },
  keyContent: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ccd6f6',
  },
  keyBackspace: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2d2d5a',
    borderWidth: 1,
    borderColor: '#3d3d6a',
  },
  keyBackspaceContent: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyBackspaceText: {
    fontSize: 24,
    color: '#8892b0',
  },
  keyEmpty: {
    width: 70,
    height: 70,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 15, 35, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8892b0',
    marginTop: 16,
  },
});