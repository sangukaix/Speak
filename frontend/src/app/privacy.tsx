import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { colors, radii, spacing } from '@/theme/tokens';

const sections = [
  {
    icon: 'mail' as const,
    title: '계정 연결 때 다루는 정보',
    body: '선택한 방식에 따라 이메일 주소(Apple의 비공개 릴레이 주소 포함), 인증 제공자 계정 식별자, 로그인 세션과 제공자가 전달하는 제한된 프로필 정보를 계정 생성·로그인·보안 확인에 사용합니다.',
  },
  {
    icon: 'shield' as const,
    title: '현재 저장하지 않는 학습 정보',
    body: '지금 데모는 음성·마이크 녹음, 자유 대화, AI 입력, 실제 학습 기록을 서버에 저장하지 않습니다.',
  },
  {
    icon: 'clock' as const,
    title: '보관과 삭제 원칙',
    body: '계정 정보는 계정이 유지되는 동안 보관하고, 탈퇴가 구현되면 본인 확인 뒤 삭제합니다. 보안 로그의 세부 기간은 출시 전 확정합니다.',
  },
];

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <Screen>
      <BackButton onPress={() => router.back()} />
      <View style={styles.heading}>
        <AppText color={colors.primary} variant="label">PRIVACY DRAFT</AppText>
        <AppText variant="title">개인정보 안내</AppText>
        <AppText color={colors.inkSoft}>
          Speak AI가 현재 계정 단계에서 어떤 정보를 다루는지 먼저 설명합니다.
        </AppText>
      </View>

      <StatusBanner
        body="서비스 운영자, 문의 채널, 처리 지역, 정확한 보관 기간은 정식 출시 전 확정하고 법률 검토를 거쳐 공개해야 합니다."
        title="아직 법적 공개본이 아닌 개발 초안입니다"
        tone="warning"
      />

      <View style={styles.sectionList}>
        {sections.map((section) => (
          <Card key={section.title} style={styles.sectionCard}>
            <View style={styles.iconFrame}>
              <AppIcon color={colors.primary} name={section.icon} size={22} />
            </View>
            <View style={styles.sectionCopy}>
              <AppText variant="bodyStrong">{section.title}</AppText>
              <AppText color={colors.inkSoft}>{section.body}</AppText>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.promiseCard}>
        <AppText variant="subheading">앞으로 지킬 기준</AppText>
        <AppText color={colors.inkSoft}>
          학습 개인화나 음성 기능을 붙이기 전에는 수집 목적과 저장 기간, 삭제 방법을 화면에서 다시 알리고 필요한 동의를 구합니다.
        </AppText>
        <AppText color={colors.inkSoft}>
          비밀번호는 앱 데이터베이스에 직접 저장하지 않고 인증 제공자의 보안 처리에 맡깁니다.
        </AppText>
        <AppText color={colors.inkSoft}>
          Google·Apple 로그인은 각 제공자의 인증 화면을 사용합니다. 현재 Speak AI는 연락처나 Drive·iCloud 콘텐츠 접근 권한을 요청하지 않습니다.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.sm, marginBottom: spacing.xxl, marginTop: spacing.xxxl, maxWidth: 620 },
  sectionList: { gap: spacing.md, marginTop: spacing.xxl },
  sectionCard: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.lg },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  sectionCopy: { flex: 1, gap: spacing.xs },
  promiseCard: { backgroundColor: colors.primarySoft, gap: spacing.md, marginTop: spacing.xxl },
});
