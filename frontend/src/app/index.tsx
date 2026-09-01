import { Redirect } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';

export default function IndexScreen() {
  const { state } = useAuth();

  if (state.status === 'restoreError') return <Redirect href="/auth/restore-error" />;
  if (state.status === 'recovering') return <Redirect href="/auth/reset" />;
  if (state.status === 'signedIn' || state.status === 'signingOut') return <Redirect href="/(tabs)" />;
  if (state.status === 'awaitingVerification') return <Redirect href="/auth/verify" />;
  return <Redirect href="/auth/sign-in" />;
}
