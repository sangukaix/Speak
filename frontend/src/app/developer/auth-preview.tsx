import type { Href } from 'expo-router';
import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { colors, radii, spacing } from '@/theme/tokens';

const previewSteps = [
  { body: 'Google·Apple·이메일 진입점과 오류 상태', icon: 'lock' as const, label: '1. 로그인', path: '/auth/sign-in' },
  { body: '동의와 비밀번호 기준', icon: 'profile' as const, label: '2. 회원가입', path: '/auth/sign-up' },
  { body: '확인 메일과 재전송', icon: 'mail' as const, label: '3. 이메일 확인', path: '/auth/verify' },
  { body: '계정 노출 없는 중립 응답', icon: 'refresh' as const, label: '4. 재설정 요청', path: '/auth/recovery' },
  { body: '복구 세션에서 새 암호 입력', icon: 'lock' as const, label: '5. 새 비밀번호', path: '/auth/reset' },
  { body: '만료·사용 완료 링크 처리', icon: 'warning' as const, label: '6. 콜백 오류', path: '/auth/callback?preview=error' },
  { body: '세션 복원 실패와 로컬 로그아웃', icon: 'shield' as const, label: '7. 복원 실패', path: '/auth/restore-error' },
] satisfies Array<{ body: string; icon: AppIconName; label: string; path: Href }>;

export default function AuthPreviewScreen() {
  const router = useRouter();

  if (process.env.NODE_ENV === 'production') return <Redirect href="/" />;

  return (
    <Screen>
      <BackButton onPress={() => router.back()} />
      <View style={styles.heading}>
        <AppText color={colors.primary} variant="label">DEVELOPER PREVIEW</AppText>
        <AppText variant="title">인증 UI 흐름 둘러보기</AppText>
        <AppText color={colors.inkSoft}>
          Supabase 프로젝트를 연결하기 전에도 각 상태의 화면과 이동 구조를 확인할 수 있습니다.
        </AppText>
      </View>

      <StatusBanner
        body="버튼으로 여는 화면은 UI 검토용입니다. 인증 설정 전에는 계정 생성이나 비밀번호 변경 요청이 전송되지 않습니다."
        title="실제 인증 동작과 분리된 개발 전용 입구입니다"
      />

      <View style={styles.stepList}>
        {previewSteps.map((step) => (
          <Card key={step.label} style={styles.stepCard}>
            <View style={styles.stepIcon}>
              <AppIcon color={colors.primary} name={step.icon} size={22} />
            </View>
            <View style={styles.stepCopy}>
              <AppText variant="bodyStrong">{step.label}</AppText>
              <AppText color={colors.inkSoft} variant="caption">{step.body}</AppText>
            </View>
            <Button icon="arrowRight" label="보기" onPress={() => router.push(step.path)} variant="secondary" />
          </Card>
        ))}
      </View>

      <Button fullWidth label="백엔드 연결 화면" onPress={() => router.push('/developer/health')} variant="ghost" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.sm, marginBottom: spacing.xxl, marginTop: spacing.xxxl, maxWidth: 620 },
  stepList: { gap: spacing.md, marginTop: spacing.xxl },
  stepCard: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  stepIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  stepCopy: { flex: 1, gap: spacing.xs },
});
