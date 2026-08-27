import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Screen } from '@/components/ui/Screen';
import { colors, radii, spacing } from '@/theme/tokens';

export default function ProfileScreen() {
  const router = useRouter();

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
            A
          </AppText>
        </View>
        <View style={styles.profileCopy}>
          <AppText variant="subheading">학습자 데모 프로필</AppText>
          <AppText color={colors.muted}>업무 영어 · 하루 10분 · 초중급</AppText>
        </View>
      </Card>

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

      <View style={styles.section}>
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
      </View>

      <Card style={styles.phaseNotice}>
        <AppIcon color={colors.muted} name="info" size={20} />
        <AppText color={colors.muted} style={styles.phaseNoticeCopy} variant="caption">
          로그인, 결제, AI, 음성 녹음, 데이터 저장은 이번 Phase 2 범위에 포함되지 않습니다.
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
