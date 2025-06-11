import './global';

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useWalletStore } from './src/store/walletStore';
import { RootStackParamList } from './src/types';

// Импорт экранов
import OnboardingScreen from './src/screens/OnboardingScreen';
import SetPinScreen from './src/screens/SetPinScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SendScreen from './src/screens/SendScreen';
import ReceiveScreen from './src/screens/ReceiveScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BackupScreen from './src/screens/BackupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Компонент загрузки
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#00ff88" />
    <Text style={styles.loadingText}>Загрузка CryptoNow...</Text>
    <Text style={styles.loadingSubtext}>
      Инициализация кошелька...
    </Text>
  </View>
);

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const { loadWallet, isWalletCreated, isLoading } = useWalletStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadWallet();
      } catch (error) {
        console.error('Ошибка инициализации:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  if (isInitializing || isLoading) {
    return (
      <>
        <LoadingScreen />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isWalletCreated ? "Dashboard" : "Onboarding"}
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#0f0f23' },
          }}
        >
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
          />
          <Stack.Screen
            name="SetPin"
            component={SetPinScreen}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
          />
          <Stack.Screen name="Send" component={SendScreen} />
          <Stack.Screen name="Receive" component={ReceiveScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="BackupScreen" component={BackupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#00ff88',
    marginTop: 20,
    fontWeight: 'bold',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 8,
  },
});