import { useRouter } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { featuredLesson } from '@/mocks/lessons';
import { colors, radii, spacing } from '@/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const stackQuickCards = width < 430;

  const openFeaturedLesson = () => {
    router.push({ pathname: '/lesson/[lessonId]', params: { lessonId: featuredLesson.id } });
  };

  return (
    <Screen>
      <View style={styles.brandRow}>
        <View style={styles.wordmark}>
          <View style={styles.brandMark}>
            <AppIcon color={colors.white} name="conversation" size={18} />
          </View>
          <AppText style={styles.brandName} variant="subheading">
            Speak AI
          </AppText>
        </View>
        <DemoBadge label="PHASE 2" />
      </View>

      <View style={styles.intro}>
        <AppText color={colors.muted} variant="label">
          오늘의 말하기
        </AppText>
        <AppText variant="title">영어가 생각에만{`\n`}머물지 않도록.</AppText>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroOrbLarge} />
        <View style={styles.heroOrbSmall} />
        <View style={styles.heroContent}>
          <DemoBadge inverse label="오늘의 7분 · 데모" />
          <View style={styles.heroCopy}>
            <AppText color={colors.white} style={styles.heroTitle} variant="heading">
              {featuredLesson.title}
            </AppText>
            <AppText color="#D8EBE6">{featuredLesson.description}</AppText>
          </View>
          <View style={styles.heroMeta}>
            <View style={styles.metaItem}>
              <AppIcon color={colors.sunshine} name="clock" size={18} />
              <AppText color={colors.white} variant="caption">
                {featuredLesson.durationMinutes}분
              </AppText>
            </View>
            <View style={styles.metaItem}>
              <AppIcon color={colors.sunshine} name="target" size={18} />
              <AppText color={colors.white} variant="caption">
                {featuredLesson.level}
              </AppText>
            </View>
          </View>
          <Button
            fullWidth
            icon="arrowRight"
            label="데모 레슨 시작"
            onPress={openFeaturedLesson}
            style={styles.heroButton}
            variant="secondary"
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          description="실제 기록이 아닌 화면 구조 검증용 샘플입니다."
          eyebrow="Your loop"
          title="말하고, 이해하고, 다시 쓰기"
        />
        <View style={[styles.quickGrid, stackQuickCards && styles.quickGridStack]}>
          <Card style={styles.quickCard}>
            <View style={[styles.quickIcon, styles.accentIcon]}>
              <AppIcon color={colors.accent} name="sparkles" size={22} />
            </View>
            <AppText color={colors.muted} variant="caption">
              이번 주 방향 · 데모
            </AppText>
            <AppText variant="subheading">의견을 더 부드럽게</AppText>
            <ProgressBar color={colors.accent} value={0.6} />
            <AppText color={colors.muted} variant="caption">
              샘플 진도 3 / 5
            </AppText>
          </Card>

          <Card style={styles.quickCard}>
            <View style={[styles.quickIcon, styles.sunshineIcon]}>
              <AppIcon color="#8A6810" name="review" size={22} />
            </View>
            <AppText color={colors.muted} variant="caption">
              다시 볼 표현 · 예시
            </AppText>
            <AppText variant="subheading">핵심 표현 3개</AppText>
            <AppText color={colors.muted}>고친 이유까지 한 번에 확인해요.</AppText>
            <Button label="복습 노트 보기" onPress={() => router.push('/(tabs)/review')} variant="ghost" />
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader eyebrow="How it works" title="빈 채팅창 대신 작은 성공부터" />
        <Card style={styles.loopCard}>
          {[
            { icon: 'book' as const, number: '01', title: '익히기', copy: '상황과 핵심 표현을 먼저 이해해요.' },
            { icon: 'conversation' as const, number: '02', title: '써보기', copy: '선택형 데모로 대화 흐름을 익혀요.' },
            { icon: 'review' as const, number: '03', title: '내 것으로', copy: '수정 근거와 다음 연습을 연결해요.' },
          ].map((step, index) => (
            <View key={step.number} style={[styles.loopStep, index > 0 && styles.loopStepBorder]}>
              <View style={styles.loopNumber}>
                <AppIcon color={colors.primary} name={step.icon} size={21} />
              </View>
              <View style={styles.loopCopy}>
                <AppText color={colors.primary} variant="caption">
                  STEP {step.number}
                </AppText>
                <AppText variant="bodyStrong">{step.title}</AppText>
                <AppText color={colors.muted} variant="caption">
                  {step.copy}
                </AppText>
              </View>
            </View>
          ))}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xxxl },
  wordmark: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 13,
    height: 38,
    justifyContent: 'center',
    transform: [{ rotate: '-4deg' }],
    width: 38,
  },
  brandName: { letterSpacing: -0.4 },
  intro: { gap: spacing.sm, marginBottom: spacing.xxl },
  heroCard: {
    backgroundColor: colors.ink,
    borderRadius: radii.xl,
    minHeight: 390,
    overflow: 'hidden',
    padding: spacing.xxl,
  },
  heroContent: { flex: 1, justifyContent: 'space-between', position: 'relative', zIndex: 2 },
  heroCopy: { gap: spacing.sm, marginVertical: spacing.xxl, maxWidth: 520 },
  heroTitle: { fontSize: 28, lineHeight: 35 },
  heroMeta: { flexDirection: 'row', gap: spacing.xxl, marginBottom: spacing.xl },
  metaItem: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  heroButton: { backgroundColor: colors.white, borderColor: colors.white },
  heroOrbLarge: {
    backgroundColor: colors.primary,
    borderRadius: 150,
    height: 300,
    opacity: 0.55,
    position: 'absolute',
    right: -110,
    top: -100,
    width: 300,
  },
  heroOrbSmall: {
    backgroundColor: colors.accent,
    borderRadius: 60,
    bottom: 76,
    height: 120,
    opacity: 0.62,
    position: 'absolute',
    right: -44,
    width: 120,
  },
  section: { gap: spacing.xl, marginTop: spacing.huge },
  quickGrid: { flexDirection: 'row', gap: spacing.lg },
  quickGridStack: { flexDirection: 'column' },
  quickCard: { flex: 1, gap: spacing.md, minWidth: 0 },
  quickIcon: { alignItems: 'center', borderRadius: radii.md, height: 44, justifyContent: 'center', width: 44 },
  accentIcon: { backgroundColor: colors.accentSoft },
  sunshineIcon: { backgroundColor: colors.sunshineSoft },
  loopCard: { paddingBottom: spacing.sm, paddingTop: spacing.sm },
  loopStep: { alignItems: 'center', flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.lg },
  loopStepBorder: { borderTopColor: colors.line, borderTopWidth: 1 },
  loopNumber: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  loopCopy: { flex: 1, gap: 2 },
});
