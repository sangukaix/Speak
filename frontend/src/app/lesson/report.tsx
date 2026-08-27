import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Screen } from '@/components/ui/Screen';
import { getLessonById } from '@/mocks/lessons';
import { colors, radii, spacing } from '@/theme/tokens';

export default function LessonReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string | string[] }>();
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
  const lesson = getLessonById(lessonId);

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.checkFrame}>
          <AppIcon color={colors.white} name="check" size={34} />
        </View>
        <DemoBadge label="예시 리포트" />
        <AppText style={styles.centerText} variant="title">
          학습 루프를 끝까지{`\n`}둘러봤어요
        </AppText>
        <AppText color={colors.muted} style={styles.centerText}>
          실제 발화 분석이나 저장 결과가 아닙니다. 리포트의 정보 구조를 보여주는 고정 샘플이에요.
        </AppText>
      </View>

      <Card style={styles.summaryCard}>
        <AppText color={colors.primary} variant="caption">
          {lesson.category} 데모 · {lesson.title}
        </AppText>
        <View style={styles.summaryRows}>
          {[
            { label: '대화 흐름', value: '상황에 맞는 응답 선택' },
            { label: '핵심 표현', value: `${lesson.keyPhrases.length}개 살펴봄` },
            { label: '분석 상태', value: '측정하지 않음' },
          ].map((item, index) => (
            <View key={item.label} style={[styles.summaryRow, index > 0 && styles.rowBorder]}>
              <AppText color={colors.muted} variant="caption">
                {item.label}
              </AppText>
              <AppText variant="label">{item.value}</AppText>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <AppIcon color={colors.accent} name="sparkles" size={23} />
          <AppText variant="subheading">오늘의 한 가지 · 예시</AppText>
        </View>
        <Card style={styles.takeawayCard}>
          <AppText color={colors.accent} variant="caption">
            TAKEAWAY
          </AppText>
          <AppText variant="heading">의견 앞에 부드러운 시작을 붙이기</AppText>
          <View style={styles.evidenceBlock}>
            <AppText color={colors.muted} variant="caption">
              직설적인 예시
            </AppText>
            <AppText style={styles.strike}>I have one opinion.</AppText>
          </View>
          <View style={[styles.evidenceBlock, styles.improvedBlock]}>
            <AppText color={colors.primary} variant="caption">
              더 자연스러운 선택
            </AppText>
            <AppText variant="bodyStrong">I'd like to add one thing.</AppText>
          </View>
          <AppText color={colors.inkSoft}>
            회의에서는 의견을 바로 선언하기보다, 덧붙일 내용이 있다고 예고하면 협력적인 인상을 줄 수 있어요.
          </AppText>
          <View style={styles.confidenceRow}>
            <AppIcon color={colors.success} name="shield" size={18} />
            <AppText color={colors.success} variant="caption">
              표현 사용 근거 · 예시 판단
            </AppText>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <AppText variant="subheading">다음 행동이 보이는 리포트</AppText>
        <Card style={styles.nextCard}>
          {[
            { icon: 'review' as const, title: '짧게 다시 보기', copy: '핵심 수정과 이유를 복습 노트에 모아요.' },
            { icon: 'conversation' as const, title: '다시 말해보기', copy: '음성 기능 연결 후 같은 문장을 재녹음해 비교해요.' },
            { icon: 'target' as const, title: '다음 레슨 추천', copy: '반복 실수 근거가 쌓인 뒤에만 개인화해요.' },
          ].map((item, index) => (
            <View key={item.title} style={[styles.nextRow, index > 0 && styles.rowBorder]}>
              <View style={styles.nextIcon}>
                <AppIcon color={colors.primary} name={item.icon} size={20} />
              </View>
              <View style={styles.nextCopy}>
                <AppText variant="bodyStrong">{item.title}</AppText>
                <AppText color={colors.muted} variant="caption">
                  {item.copy}
                </AppText>
              </View>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.actions}>
        <Button fullWidth icon="review" label="예시 복습 노트 보기" onPress={() => router.replace('/(tabs)/review')} />
        <Button fullWidth label="홈으로" onPress={() => router.replace('/(tabs)')} variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  checkFrame: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 66,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 66,
  },
  centerText: { maxWidth: 560, textAlign: 'center' },
  summaryCard: { gap: spacing.lg, marginTop: spacing.xxxl },
  summaryRows: { gap: 0 },
  summaryRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', paddingVertical: spacing.md },
  rowBorder: { borderTopColor: colors.line, borderTopWidth: 1 },
  section: { gap: spacing.md, marginTop: spacing.xxxl },
  sectionTitleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  takeawayCard: { backgroundColor: colors.accentSoft, gap: spacing.lg },
  evidenceBlock: { gap: spacing.xs },
  strike: { color: colors.muted, textDecorationLine: 'line-through' },
  improvedBlock: { backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg },
  confidenceRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  nextCard: { paddingBottom: spacing.sm, paddingTop: spacing.sm },
  nextRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.lg },
  nextIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  nextCopy: { flex: 1, gap: 2 },
  actions: { gap: spacing.md, marginTop: spacing.xxxl },
});
