import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { DemoBadge } from '@/components/ui/DemoBadge';
import type { Lesson } from '@/features/lessons/types';
import { colors, radii, shadows, spacing } from '@/theme/tokens';

const categoryIcons: Record<Lesson['category'], AppIconName> = {
  업무: 'work',
  일상: 'conversation',
  여행: 'travel',
};

type LessonCardProps = {
  lesson: Lesson;
  onPress: () => void;
};

export function LessonCard({ lesson, onPress }: LessonCardProps) {
  return (
    <Pressable
      accessibilityLabel={`${lesson.title}, ${lesson.durationMinutes}분 데모 레슨 열기`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconFrame}>
          <AppIcon color={colors.primary} name={categoryIcons[lesson.category]} size={23} />
        </View>
        <DemoBadge />
      </View>

      <View style={styles.copy}>
        <View style={styles.metaRow}>
          <AppText color={colors.primary} variant="caption">
            {lesson.category}
          </AppText>
          <View style={styles.dot} />
          <AppText color={colors.muted} variant="caption">
            {lesson.level} · {lesson.durationMinutes}분
          </AppText>
        </View>
        <AppText variant="subheading">{lesson.title}</AppText>
        <AppText color={colors.muted} style={styles.description}>
          {lesson.description}
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppText color={colors.primary} variant="label">
          레슨 살펴보기
        </AppText>
        <AppIcon color={colors.primary} name="arrowRight" size={19} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  pressed: { opacity: 0.78, transform: [{ scale: 0.995 }] },
  topRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  copy: { gap: spacing.sm },
  metaRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  dot: { backgroundColor: colors.line, borderRadius: 2, height: 4, width: 4 },
  description: { lineHeight: 23 },
  footer: {
    alignItems: 'center',
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
});
