import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthLoadingScreen } from '@/components/auth/AuthLoadingScreen';
import { SigningOutOverlay } from '@/components/auth/SigningOutOverlay';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { isAllowedProtectedPath } from '@/features/auth/routes';
import { colors } from '@/theme/tokens';

const isDevelopment = process.env.NODE_ENV !== 'production';

function RootNavigator() {
  const pathname = usePathname();
  const { rememberNextPath, state } = useAuth();
  const isAuthEntryState = state.status === 'signedOut' || state.status === 'awaitingVerification';
  const isAppState = state.status === 'signedIn' || state.status === 'signingOut';

  useEffect(() => {
    if (!isAppState && isAllowedProtectedPath(pathname)) rememberNextPath(pathname);
  }, [isAppState, pathname, rememberNextPath]);

  if (state.status === 'booting') return <AuthLoadingScreen />;

  return (
    <>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Protected guard={isAuthEntryState || isDevelopment}>
          <Stack.Screen name="auth/sign-in" />
          <Stack.Screen name="auth/sign-up" />
          <Stack.Screen name="auth/recovery" />
        </Stack.Protected>
        <Stack.Protected guard={state.status === 'awaitingVerification' || isDevelopment}>
          <Stack.Screen name="auth/verify" />
        </Stack.Protected>
        <Stack.Protected guard={state.status === 'recovering' || isDevelopment}>
          <Stack.Screen name="auth/reset" />
        </Stack.Protected>
        <Stack.Protected guard={state.status === 'restoreError' || isDevelopment}>
          <Stack.Screen name="auth/restore-error" />
        </Stack.Protected>

        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="privacy" />

        <Stack.Protected guard={isAppState}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lesson/[lessonId]" />
          <Stack.Screen name="lesson/session" />
          <Stack.Screen name="lesson/report" />
        </Stack.Protected>

        <Stack.Protected guard={isDevelopment}>
          <Stack.Screen name="developer/auth-preview" />
          <Stack.Screen name="developer/health" />
        </Stack.Protected>
      </Stack>
      {state.status === 'signingOut' ? <SigningOutOverlay /> : null}
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
