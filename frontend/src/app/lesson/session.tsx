import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { getLessonById } from '@/mocks/lessons';
import { colors, layout, radii, spacing } from '@/theme/tokens';

export default function LessonSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string | string[] }>();
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
  const lesson = getLessonById(lessonId);
  const [turnIndex, setTurnIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const turn = lesson.dialogue[turnIndex];
  const selectedOption = turn.options.find((option) => option.id === selectedOptionId);
  const isLastTurn = turnIndex === lesson.dialogue.length - 1;
  const progress = (turnIndex + 1) / lesson.dialogue.length;

  const continueLesson = () => {
    if (!selectedOptionId) return;

    if (isLastTurn) {
      router.replace({ pathname: '/lesson/report', params: { lessonId: lesson.id } });
      return;
    }

    setTurnIndex((current) => current + 1);
    setSelectedOptionId(null);
  };

  return (
    <Screen>
      <View style={styles.topBar}>
        <BackButton onPress={() => router.back()} />
        <View style={styles.titleArea}>
          <AppText numberOfLines={1} variant="label">
            {lesson.title}
          </AppText>
          <AppText color={colors.muted} variant="caption">
            선택형 데모
          </AppText>
        </View>
        <DemoBadge label={`${turnIndex + 1} / ${lesson.dialogue.length}`} />
      </View>

      <ProgressBar value={progress} />

      <View style={styles.contextBlock}>
        <AppText color={colors.primary} variant="caption">
          지금 상황
        </AppText>
        <AppText variant="bodyStrong">{turn.context}</AppText>
      </View>

      <View style={styles.dialogueArea}>
        <View style={styles.tutorRow}>
          <View style={styles.tutorAvatar}>
            <AppIcon color={colors.white} name="sparkles" size={21} />
          </View>
          <View style={styles.tutorBubble}>
            <AppText color={colors.muted} variant="caption">
              AI 튜터 역할 · 고정 스크립트
            </AppText>
            <AppText variant="bodyStrong">{turn.tutorPrompt}</AppText>
          </View>
        </View>

        <View style={styles.responseSection}>
          <AppText variant="subheading">어떻게 답해볼까요?</AppText>
          <AppText color={colors.muted} variant="caption">
            실제 AI 생성이 아닌 미리 작성된 문장입니다.
          </AppText>
          <View style={styles.optionList}>
            {turn.options.map((option) => {
              const selected = selectedOptionId === option.id;
              return (
                <Pressable
                  key={option.id}
                  accessibilityLabel={`응답 선택: ${option.text}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setSelectedOptionId(option.id)}
                  style={({ pressed }) => [
                    styles.option,
                    selected && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                  <AppText style={styles.optionText} variant="bodyStrong">
                    {option.text}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {selectedOption ? (
          <Card style={styles.coachNote}>
            <View style={styles.coachTitle}>
              <AppIcon color={colors.success} name="check" size={20} />
              <AppText color={colors.success} variant="label">
                문장 선택 팁 · 예시
              </AppText>
            </View>
            <AppText color={colors.inkSoft}>{selectedOption.coachNote}</AppText>
          </Card>
        ) : null}

        <View style={styles.micPlaceholder}>
          <AppIcon color={colors.muted} name="micOff" size={21} />
          <View style={styles.micCopy}>
            <AppText color={colors.muted} variant="label">
              말하기 기능은 아직 연결 전
            </AppText>
            <AppText color={colors.muted} variant="caption">
              녹음 중인 것처럼 보이는 애니메이션도 사용하지 않습니다.
            </AppText>
          </View>
        </View>
      </View>

      <Button
        disabled={!selectedOptionId}
        fullWidth
        icon="arrowRight"
        label={isLastTurn ? '예시 리포트 보기' : '이 문장으로 계속'}
        onPress={continueLesson}
        style={styles.continueButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  titleArea: { alignItems: 'center', flex: 1 },
  contextBlock: { gap: spacing.sm, marginTop: spacing.xxl },
  dialogueArea: { gap: spacing.xxl, marginTop: spacing.xxl },
  tutorRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  tutorAvatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  tutorBubble: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.lg,
    borderTopLeftRadius: radii.sm,
    borderWidth: 1,
    flex: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  responseSection: { gap: spacing.sm },
  optionList: { gap: spacing.md, marginTop: spacing.sm },
  option: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: layout.minimumTouchTarget,
    padding: spacing.lg,
  },
  optionSelected: { backgroundColor: colors.primarySoft, borderColor: colors.primary, borderWidth: 2 },
  optionPressed: { opacity: 0.75 },
  radio: {
    alignItems: 'center',
    borderColor: colors.muted,
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: { backgroundColor: colors.primary, borderRadius: radii.pill, height: 10, width: 10 },
  optionText: { flex: 1 },
  coachNote: { backgroundColor: colors.successSoft, gap: spacing.sm },
  coachTitle: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  micPlaceholder: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: radii.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  micCopy: { flex: 1, gap: 2 },
  continueButton: { marginTop: spacing.xxl },
});
