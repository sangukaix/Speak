import { useRouter } from 'expo-router';
import { useState } from 'react';

import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { useAuth } from '@/features/auth/AuthProvider';

export default function RestoreErrorScreen() {
  const router = useRouter();
  const { clearLocalSession, retryRestore, state } = useAuth();
  const [retrying, setRetrying] = useState(false);

  async function handleRetry() {
    setRetrying(true);
    await retryRestore();
    setRetrying(false);
    router.replace('/');
  }

  async function handleClear() {
    await clearLocalSession();
    router.replace('/auth/sign-in');
  }

  return (
    <AuthShell
      description="저장된 로그인 상태를 안전하게 확인하지 못해 앱 화면을 잠시 잠갔습니다."
      title="로그인 상태를 불러오지 못했어요"
    >
      <StatusBanner
        body="네트워크가 안정적인지 확인한 뒤 다시 시도해 주세요. 계속되면 이 기기의 로그인 정보만 지우고 다시 로그인할 수 있습니다."
        title="계정이나 학습 기록이 삭제된 것은 아닙니다"
        tone="warning"
      />
      <Button
        fullWidth
        label="다시 확인"
        loading={retrying || state.status === 'booting'}
        onPress={() => void handleRetry()}
      />
      <Button fullWidth label="이 기기에서 로그아웃" onPress={() => void handleClear()} variant="secondary" />
    </AuthShell>
  );
}
