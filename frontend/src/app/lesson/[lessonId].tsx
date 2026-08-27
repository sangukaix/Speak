import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Screen } from '@/components/ui/Screen';
import { getLessonById } from '@/mocks/lessons';
import { colors, radii, spacing } from '@/theme/tokens';

export default function LessonDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string | string[] }>();
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
  const lesson = getLessonById(lessonId);

  return (
    <Screen>
      <View style={styles.topBar}>
        <BackButton onPress={() => router.back()} />
        <DemoBadge label="데모 레슨" />
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <AppIcon color={colors.primary} name="conversation" size={27} />
        </View>
        <View style={styles.heroCopy}>
          <AppText color={colors.primary} variant="label">
            {lesson.category} · {lesson.level}
          </AppText>
          <AppText variant="title">{lesson.title}</AppText>
          <AppText color={colors.muted}>{lesson.description}</AppText>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <AppIcon color={colors.inkSoft} name="clock" size={18} />
            <AppText color={colors.inkSoft} variant="caption">
              약 {lesson.durationMinutes}분
            </AppText>
          </View>
          <View style={styles.metaPill}>
            <AppIcon color={colors.inkSoft} name="practice" size={18} />
            <AppText color={colors.inkSoft} variant="caption">
              {lesson.dialogue.length}턴 연습
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="subheading">이번 레슨에서 해볼 일</AppText>
        <Card style={styles.objectiveCard}>
          {lesson.objectives.map((objective, index) => (
            <View key={objective} style={[styles.objectiveRow, index > 0 && styles.rowBorder]}>
              <View style={styles.numberCircle}>
                <AppText color={colors.primary} variant="caption">
                  {index + 1}
                </AppText>
              </View>
              <AppText style={styles.objectiveText}>{objective}</AppText>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <AppText variant="subheading">먼저 익힐 표현</AppText>
        <View style={styles.phraseList}>
          {lesson.keyPhrases.map((phrase) => (
            <Card key={phrase.english} style={styles.phraseCard}>
              <View style={styles.phraseTop}>
                <AppIcon color={colors.primary} name="sound" size={20} />
                <AppText variant="bodyStrong">{phrase.english}</AppText>
              </View>
              <AppText color={colors.muted} variant="caption">
                {phrase.korean}
              </AppText>
            </Card>
          ))}
        </View>
      </View>

      <Card style={styles.mockNotice}>
        <AppIcon color={colors.accent} name="micOff" size={22} />
        <View style={styles.mockNoticeCopy}>
          <AppText variant="bodyStrong">이번 데모는 선택형 연습이에요</AppText>
          <AppText color={colors.muted} variant="caption">
            마이크·음성 인식·AI 피드백은 아직 연결되지 않았습니다. 정해진 선택지로 전체 학습 흐름을 체험합니다.
          </AppText>
        </View>
      </Card>

      <Button
        fullWidth
        icon="play"
        label="선택형 데모 시작"
        onPress={() => router.push({ pathname: '/lesson/session', params: { lessonId: lesson.id } })}
        style={styles.startButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xxxl },
  hero: { gap: spacing.lg },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.lg,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  heroCopy: { gap: spacing.sm, maxWidth: 600 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metaPill: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  section: { gap: spacing.md, marginTop: spacing.xxxl },
  objectiveCard: { paddingBottom: spacing.sm, paddingTop: spacing.sm },
  objectiveRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.lg },
  rowBorder: { borderTopColor: colors.line, borderTopWidth: 1 },
  numberCircle: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  objectiveText: { flex: 1 },
  phraseList: { gap: spacing.md },
  phraseCard: { gap: spacing.sm },
  phraseTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  mockNotice: { alignItems: 'flex-start', backgroundColor: colors.accentSoft, flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxxl },
  mockNoticeCopy: { flex: 1, gap: spacing.xs },
  startButton: { marginTop: spacing.xl },
});
