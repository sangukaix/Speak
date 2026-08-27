import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Screen } from '@/components/ui/Screen';
import type { ReviewKind } from '@/features/lessons/types';
import { reviewItems } from '@/mocks/review';
import { colors, radii, spacing } from '@/theme/tokens';

type ReviewFilter = '전체' | ReviewKind;

const filters: ReviewFilter[] = ['전체', '표현', '문법', '발음'];
const kindIcons: Record<ReviewKind, AppIconName> = { 표현: 'sparkles', 문법: 'book', 발음: 'sound' };

export default function ReviewScreen() {
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('전체');
  const filteredItems = useMemo(
    () => (activeFilter === '전체' ? reviewItems : reviewItems.filter((item) => item.kind === activeFilter)),
    [activeFilter],
  );

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <AppText color={colors.primary} variant="label">
            REVIEW WITH EVIDENCE
          </AppText>
          <AppText variant="title">복습 노트</AppText>
        </View>
        <DemoBadge label="예시 리포트" />
      </View>

      <Card style={styles.promiseCard}>
        <View style={styles.promiseIcon}>
          <AppIcon color={colors.primary} name="shield" size={24} />
        </View>
        <View style={styles.promiseCopy}>
          <AppText variant="subheading">점수보다 먼저, 고친 근거</AppText>
          <AppText color={colors.muted}>
            무엇을 왜 바꾸는지 보여주고, 확실하지 않은 판단은 학습 제안으로 구분합니다.
          </AppText>
        </View>
      </Card>

      <View style={styles.filters} accessibilityRole="tablist">
        {filters.map((filter) => (
          <Chip key={filter} label={filter} onPress={() => setActiveFilter(filter)} selected={activeFilter === filter} />
        ))}
      </View>

      <View style={styles.list}>
        {filteredItems.map((item) => (
          <Card key={item.id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <View style={styles.kindRow}>
                <View style={styles.kindIcon}>
                  <AppIcon color={colors.primary} name={kindIcons[item.kind]} size={19} />
                </View>
                <AppText color={colors.primary} variant="label">
                  {item.kind}
                </AppText>
              </View>
              <AppText color={colors.muted} variant="caption">
                {item.lessonTitle}
              </AppText>
            </View>

            <View style={styles.comparison}>
              <View style={styles.sentenceBlock}>
                <AppText color={colors.muted} variant="caption">
                  예시 발화
                </AppText>
                <AppText style={styles.original}>{item.original}</AppText>
              </View>
              <View style={styles.arrowFrame}>
                <AppIcon color={colors.primary} name="arrowRight" size={18} />
              </View>
              <View style={[styles.sentenceBlock, styles.improvedBlock]}>
                <AppText color={colors.primary} variant="caption">
                  더 자연스럽게
                </AppText>
                <AppText variant="bodyStrong">{item.improved}</AppText>
              </View>
            </View>

            <View style={styles.reasonBox}>
              <AppText color={colors.inkSoft} variant="caption">
                {item.reason}
              </AppText>
            </View>
            <View style={styles.confidenceRow}>
              <AppIcon color={colors.success} name="check" size={17} />
              <AppText color={colors.success} variant="caption">
                {item.confidenceLabel}
              </AppText>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.noticeCard}>
        <AppIcon color={colors.muted} name="info" size={21} />
        <AppText color={colors.muted} style={styles.noticeCopy} variant="caption">
          이 항목들은 UX 검증용 고정 예시입니다. 실제 음성 분석, 저장, 개인화는 연결되지 않았습니다.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xxl },
  headerCopy: { gap: spacing.xs },
  promiseCard: { alignItems: 'flex-start', backgroundColor: colors.primarySoft, flexDirection: 'row', gap: spacing.lg },
  promiseIcon: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  promiseCopy: { flex: 1, gap: spacing.sm },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xxl },
  list: { gap: spacing.lg, marginTop: spacing.xxl },
  reviewCard: { gap: spacing.lg },
  reviewTop: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'space-between' },
  kindRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  kindIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.sm,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  comparison: { gap: spacing.md },
  sentenceBlock: { gap: spacing.xs },
  original: { color: colors.muted, textDecorationLine: 'line-through' },
  arrowFrame: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.surfaceMuted, borderRadius: radii.pill, padding: 6 },
  improvedBlock: { backgroundColor: colors.successSoft, borderRadius: radii.md, padding: spacing.lg },
  reasonBox: { backgroundColor: colors.surfaceMuted, borderRadius: radii.md, padding: spacing.lg },
  confidenceRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  noticeCard: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  noticeCopy: { flex: 1 },
});
