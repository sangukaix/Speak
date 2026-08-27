import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LessonCard } from '@/components/lesson/LessonCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { LessonCategory } from '@/features/lessons/types';
import { lessons } from '@/mocks/lessons';
import { colors, radii, spacing } from '@/theme/tokens';

type LessonFilter = '추천' | LessonCategory;

const filters: LessonFilter[] = ['추천', '업무', '일상', '여행'];

export default function PracticeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<LessonFilter>('추천');
  const filteredLessons = useMemo(
    () => (activeFilter === '추천' ? lessons : lessons.filter((lesson) => lesson.category === activeFilter)),
    [activeFilter],
  );

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <AppText color={colors.primary} variant="label">
            PRACTICE ROOM
          </AppText>
          <AppText variant="title">연습실</AppText>
        </View>
        <DemoBadge />
      </View>

      <Card style={styles.pathCard}>
        <View style={styles.pathTop}>
          <View style={styles.pathIcon}>
            <AppIcon color={colors.white} name="work" size={24} />
          </View>
          <View style={styles.pathCopy}>
            <AppText color={colors.primary} variant="caption">
              추천 경로 · 데모
            </AppText>
            <AppText variant="subheading">업무 영어 스타터</AppText>
          </View>
          <AppText color={colors.muted} variant="caption">
            1 / 4
          </AppText>
        </View>
        <ProgressBar value={0.25} />
        <AppText color={colors.muted} variant="caption">
          샘플 진도입니다. 실제 학습 기록은 아직 저장되지 않아요.
        </AppText>
      </Card>

      <View style={styles.filters} accessibilityRole="tablist">
        {filters.map((filter) => (
          <Chip key={filter} label={filter} onPress={() => setActiveFilter(filter)} selected={activeFilter === filter} />
        ))}
      </View>

      <View style={styles.lessonSection}>
        <SectionHeader
          description="말할 상황과 목표를 먼저 확인한 뒤 시작합니다."
          title={activeFilter === '추천' ? '지금 해볼 만한 레슨' : `${activeFilter} 상황 레슨`}
        />
        <View style={styles.lessonList}>
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onPress={() => router.push({ pathname: '/lesson/[lessonId]', params: { lessonId: lesson.id } })}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xxl },
  headerCopy: { gap: spacing.xs },
  pathCard: { backgroundColor: colors.primarySoft, gap: spacing.lg },
  pathTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  pathIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  pathCopy: { flex: 1, gap: 1 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xxl },
  lessonSection: { gap: spacing.xl, marginTop: spacing.xxxl },
  lessonList: { gap: spacing.lg },
});
