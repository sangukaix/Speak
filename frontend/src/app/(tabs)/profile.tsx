import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Screen } from '@/components/ui/Screen';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { useAuth } from '@/features/auth/AuthProvider';
import { getAuthErrorMessage } from '@/features/auth/errors';
import { colors, radii, spacing } from '@/theme/tokens';

export default function ProfileScreen() {
  const router = useRouter();
  const { isConfigured, signOut, state } = useAuth();
  const [signOutError, setSignOutError] = useState<string>();
  const email = state.session?.user.email ?? '연결된 이메일';
  const avatarLetter = email.slice(0, 1).toUpperCase();
  const isDevelopment = process.env.NODE_ENV !== 'production';

  async function handleSignOut() {
    setSignOutError(undefined);
    try {
      await signOut();
      router.replace('/auth/sign-in');
    } catch (error) {
      setSignOutError(getAuthErrorMessage(error, '로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요.'));
    }
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <AppText color={colors.primary} variant="label">
            MY LEARNING
          </AppText>
          <AppText variant="title">나</AppText>
        </View>
        <DemoBadge />
      </View>

      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <AppText color={colors.white} variant="heading">
            {avatarLetter}
          </AppText>
        </View>
        <View style={styles.profileCopy}>
          <AppText variant="subheading">내 학습 프로필</AppText>
          <AppText color={colors.inkSoft}>{email}</AppText>
        </View>
      </Card>

      <View style={styles.section}>
        <AppText variant="subheading">계정과 개인정보</AppText>
        {signOutError ? <StatusBanner body={signOutError} title="로그아웃을 완료하지 못했습니다" tone="error" /> : null}
        <Card style={styles.accountCard}>
          <View style={styles.accountCopy}>
            <AppText variant="bodyStrong">로그인된 기기 관리</AppText>
            <AppText color={colors.inkSoft} variant="caption">
              로그아웃하면 이 기기에 저장된 세션이 지워집니다.
            </AppText>
          </View>
          <View style={styles.accountActions}>
            <Button label="개인정보 안내" onPress={() => router.push('/privacy')} variant="secondary" />
            <Button icon="logout" label="로그아웃" onPress={() => void handleSignOut()} />
          </View>
        </Card>
        <Card style={styles.deleteCard}>
          <View style={styles.accountCopy}>
            <AppText color={colors.danger} variant="bodyStrong">계정 탈퇴</AppText>
            <AppText color={colors.inkSoft} variant="caption">
              서버 삭제 검증을 완성한 뒤 제공됩니다. 지금은 실제 삭제 요청을 받지 않습니다.
            </AppText>
          </View>
          <Button disabled icon="trash" label="탈퇴 준비 중" onPress={() => undefined} variant="danger" />
        </Card>
      </View>

      <View style={styles.section}>
        <AppText variant="subheading">학습 방향 · 예시</AppText>
        <Card style={styles.settingsCard}>
          {[
            { icon: 'target' as const, label: '가장 중요한 목표', value: '회의에서 자신 있게 말하기' },
            { icon: 'clock' as const, label: '원하는 학습 시간', value: '하루 10분' },
            { icon: 'conversation' as const, label: '피드백 방식', value: '대화 후 핵심 3개만' },
          ].map((item, index) => (
            <View key={item.label} style={[styles.settingRow, index > 0 && styles.settingBorder]}>
              <View style={styles.settingIcon}>
                <AppIcon color={colors.primary} name={item.icon} size={21} />
              </View>
              <View style={styles.settingCopy}>
                <AppText color={colors.muted} variant="caption">
                  {item.label}
                </AppText>
                <AppText variant="bodyStrong">{item.value}</AppText>
              </View>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <AppText variant="subheading">신뢰를 위한 약속</AppText>
        <Card style={styles.trustCard}>
          <View style={styles.trustTitle}>
            <AppIcon color={colors.primary} name="shield" size={23} />
            <AppText variant="bodyStrong">기억은 보이고, 고칠 수 있게</AppText>
          </View>
          <AppText color={colors.muted}>
            향후 개인화가 연결되면 저장하는 목표와 반복 실수를 직접 확인·수정·삭제할 수 있게 설계합니다.
          </AppText>
          <DemoBadge label="기능 미연결" />
        </Card>
      </View>

      {isDevelopment ? <View style={styles.section}>
        <AppText variant="subheading">개발 도구</AppText>
        <Card style={styles.devCard}>
          <View style={styles.devCopy}>
            <AppText variant="bodyStrong">백엔드 연결 확인</AppText>
            <AppText color={colors.muted} variant="caption">
              Phase 1에서 만든 실제 GET /health 점검 화면입니다.
            </AppText>
          </View>
          <Button icon="arrowRight" label="열기" onPress={() => router.push('/developer/health')} variant="secondary" />
        </Card>
      </View> : null}

      <Card style={styles.phaseNotice}>
        <AppIcon color={colors.muted} name="info" size={20} />
        <AppText color={colors.muted} style={styles.phaseNoticeCopy} variant="caption">
          {isConfigured
            ? '계정 인증은 연결되어 있습니다. 결제, AI, 음성 녹음, 학습 기록 저장은 아직 연결되지 않았습니다.'
            : '인증 화면은 준비되었지만 인증 서버 설정이 아직 없습니다. 결제, AI, 음성 녹음, 학습 기록 저장도 연결되지 않았습니다.'}
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xxl },
  headerCopy: { gap: spacing.xs },
  profileCard: { alignItems: 'center', flexDirection: 'row', gap: spacing.lg },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  profileCopy: { flex: 1, gap: spacing.xs },
  accountCard: { gap: spacing.lg },
  accountCopy: { flex: 1, gap: spacing.xs },
  accountActions: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  deleteCard: { alignItems: 'center', borderColor: colors.dangerSoft, borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  section: { gap: spacing.md, marginTop: spacing.xxxl },
  settingsCard: { paddingBottom: spacing.sm, paddingTop: spacing.sm },
  settingRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.lg },
  settingBorder: { borderTopColor: colors.line, borderTopWidth: 1 },
  settingIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  settingCopy: { flex: 1, gap: 2 },
  trustCard: { backgroundColor: colors.primarySoft, gap: spacing.md },
  trustTitle: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  devCard: { alignItems: 'center', flexDirection: 'row', gap: spacing.lg },
  devCopy: { flex: 1, gap: spacing.xs },
  phaseNotice: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxxl },
  phaseNoticeCopy: { flex: 1 },
});
