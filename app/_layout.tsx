import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

import { ProgressProvider } from '../src/contexts/ProgressContext';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)' || segments[0] === 'login' || segments[0] === 'signup';

    if (!user && !inAuthGroup) {
      // Redirect to the login page if not signed in
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirect away from the login page if signed in
      router.replace('/');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#58CC02" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#3C3C3C',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="study" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: 'My Profile', headerBackTitleVisible: false, headerTitleStyle: { fontWeight: '800' } }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: 'Create Account', headerBackTitleVisible: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <RootLayoutNav />
      </ProgressProvider>
    </AuthProvider>
  );
}
