import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing } from '@/theme/tokens';

type ConnectionState = 'checking' | 'connected' | 'disconnected';
type HealthResponse = { status: 'ok' };

const defaultApiUrl = Platform.select({
  android: 'http://10.0.2.2:8000',
  default: 'http://localhost:8000',
});

const apiBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL ?? defaultApiUrl).replace(/\/$/, '');

export default function HealthScreen() {
  const router = useRouter();
  const [connectionState, setConnectionState] = useState<ConnectionState>('checking');

  const checkBackend = useCallback(async () => {
    setConnectionState('checking');
    try {
      const response = await fetch(`${apiBaseUrl}/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as HealthResponse;
      setConnectionState(data.status === 'ok' ? 'connected' : 'disconnected');
    } catch {
      setConnectionState('disconnected');
    }
  }, []);

  useEffect(() => {
    void checkBackend();
  }, [checkBackend]);

  const connected = connectionState === 'connected';

  return (
    <Screen>
      <BackButton onPress={() => router.back()} />
      <View style={styles.header}>
        <AppText color={colors.primary} variant="label">
          DEVELOPER TOOL
        </AppText>
        <AppText variant="title">백엔드 연결 확인</AppText>
        <AppText color={colors.muted}>
          이 화면은 Mock이 아니라 FastAPI의 실제 GET /health 응답을 확인합니다.
        </AppText>
      </View>

      <Card style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={[styles.statusDot, connected && styles.statusDotConnected]} />
          <AppText color={colors.muted} variant="label">
            API STATUS
          </AppText>
        </View>
        {connectionState === 'checking' ? (
          <View style={styles.checkingRow}>
            <ActivityIndicator color={colors.primary} />
            <AppText variant="heading">확인 중…</AppText>
          </View>
        ) : (
          <AppText color={connected ? colors.success : colors.danger} variant="heading">
            {connected ? 'Backend Connected' : 'Backend Disconnected'}
          </AppText>
        )}
        <AppText color={colors.muted} numberOfLines={2} variant="caption">
          {apiBaseUrl}/health
        </AppText>
      </Card>

      <Button fullWidth label="연결 다시 확인" onPress={() => void checkBackend()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginBottom: spacing.xxxl, marginTop: spacing.xxxl, maxWidth: 580 },
  statusCard: { gap: spacing.lg, marginBottom: spacing.lg },
  statusHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  statusDot: { backgroundColor: colors.danger, borderRadius: 6, height: 12, width: 12 },
  statusDotConnected: { backgroundColor: colors.success },
  checkingRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
});
