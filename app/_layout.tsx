import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '@/context/AppContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { initRevenueCat } from '@/lib/revenueCat';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    initRevenueCat().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FAFAF9' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="coach/[id]" />
        <Stack.Screen name="coach/create" />
        <Stack.Screen name="chat/[coachId]" />
        <Stack.Screen name="paywall" />
      </Stack>
      </AppProvider>
    </ErrorBoundary>
  );
}
