import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ProgressProvider } from '../src/contexts/ProgressContext';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.bgHeader },
            headerTintColor: COLORS.accentPurple,
            headerTitleStyle: { fontWeight: '700', color: COLORS.textPrimary },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: COLORS.bgDeep },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="study" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile"
            options={{
              title: 'My Profile',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>
      </ProgressProvider>
    </AuthProvider>
  );
}
