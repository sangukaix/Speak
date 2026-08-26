import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ConnectionState = 'checking' | 'connected' | 'disconnected';
type HealthResponse = { status: 'ok' };

const defaultApiUrl = Platform.select({
  android: 'http://10.0.2.2:8000',
  default: 'http://localhost:8000',
});

const apiBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL ?? defaultApiUrl).replace(/\/$/, '');

export default function HomeScreen() {
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>SPEAK AI · PHASE 1</Text>
        <Text style={styles.title}>AI 영어회화의{`\n`}튼튼한 시작</Text>
        <Text style={styles.description}>
          Web, Android, iOS가 하나의 코드베이스를 사용합니다. 지금은 백엔드 연결 상태만 검증합니다.
        </Text>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusDot, connected && styles.statusDotConnected]} />
            <Text style={styles.statusLabel}>API Status</Text>
          </View>
          {connectionState === 'checking' ? (
            <View style={styles.checkingRow}>
              <ActivityIndicator color="#3563E9" />
              <Text style={styles.statusValue}>Checking backend…</Text>
            </View>
          ) : (
            <Text style={[styles.statusValue, connected && styles.connectedText]}>
              {connected ? 'Backend Connected' : 'Backend Disconnected'}
            </Text>
          )}
          <Text numberOfLines={1} style={styles.apiUrl}>
            {apiBaseUrl}/health
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => void checkBackend()}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>연결 다시 확인</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  eyebrow: {
    color: '#3563E9',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 18,
  },
  title: {
    color: '#182230',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.4,
    lineHeight: 50,
    marginBottom: 18,
  },
  description: { color: '#526071', fontSize: 17, lineHeight: 27, marginBottom: 32 },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E6EF',
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    marginBottom: 16,
  },
  statusHeader: { alignItems: 'center', flexDirection: 'row', gap: 9, marginBottom: 14 },
  statusDot: { backgroundColor: '#D14343', borderRadius: 5, height: 10, width: 10 },
  statusDotConnected: { backgroundColor: '#1E9E65' },
  statusLabel: { color: '#667085', fontSize: 14, fontWeight: '600' },
  checkingRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  statusValue: { color: '#B54747', fontSize: 24, fontWeight: '700' },
  connectedText: { color: '#18794E' },
  apiUrl: { color: '#98A2B3', fontSize: 12, marginTop: 10 },
  button: {
    alignItems: 'center',
    backgroundColor: '#3563E9',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonPressed: { opacity: 0.82 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
