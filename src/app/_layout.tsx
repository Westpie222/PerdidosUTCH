import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LostItemsProvider } from '../context/LostItemsContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LostItemsProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FFFFFF' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </LostItemsProvider>
    </SafeAreaProvider>
  );
}
