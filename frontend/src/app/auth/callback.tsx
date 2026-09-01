import type { Href } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, spacing } from '@/theme/tokens';

type CallbackState = 'processing' | 'error';

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    code?: string | string[];
    error?: string | string[];
    preview?: string | string[];
  }>();
  const { cancelCallback, completeCallback, consumeNextPath } = useAuth();
  const [callbackState, setCallbackState] = useState<CallbackState>('processing');
  const handledRef = useRef(false);
  const code = firstParam(params.code);
  const callbackError = firstParam(params.error);
  const preview = firstParam(params.preview);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    if (preview === 'processing') return;
    if (callbackError === 'access_denied') {
      void cancelCallback().finally(() => router.replace('/auth/sign-in'));
      return;
    }
    if (preview === 'error' || !code) {
      setCallbackState('error');
      return;
    }

    let active = true;
    void completeCallback(code)
      .then((intent) => {
        if (!active) return;
        if (intent === 'recovery') {
          router.replace('/auth/reset');
          return;
        }
        router.replace((consumeNextPath() ?? '/(tabs)') as Href);
      })
      .catch(() => {
        if (active) setCallbackState('error');
      });

    return () => {
      active = false;
    };
  }, [callbackError, cancelCallback, code, completeCallback, consumeNextPath, preview, router]);

  return (
    <AuthShell
      description="보안 인증 결과를 확인하고 다음 화면을 준비하고 있습니다."
      title={callbackState === 'processing' ? '계정을 확인하고 있어요' : '링크를 확인하지 못했어요'}
    >
      {callbackState === 'processing' ? (
        <View accessibilityLiveRegion="polite" style={styles.processing}>
          <ActivityIndicator color={colors.primary} size="large" />
          <StatusBanner
            body="잠시만 기다려 주세요. 링크나 인증 코드는 화면에 표시하거나 저장하지 않습니다."
            title="안전하게 연결 중입니다"
          />
        </View>
      ) : (
        <>
          <StatusBanner
            body="링크가 만료되었거나 이미 사용되었을 수 있습니다. 필요한 안내를 다시 요청해 주세요."
            title="새 링크가 필요합니다"
            tone="error"
          />
          <Button fullWidth label="로그인으로 돌아가기" onPress={() => router.replace('/auth/sign-in')} />
          <Button fullWidth label="비밀번호 재설정 다시 요청" onPress={() => router.replace('/auth/recovery')} variant="secondary" />
        </>
      )}
    </AuthShell>
  );
}

const styles = StyleSheet.create({ processing: { gap: spacing.xl } });
