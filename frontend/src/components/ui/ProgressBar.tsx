import { StyleSheet, View } from 'react-native';

import { colors, radii } from '@/theme/tokens';

type ProgressBarProps = {
  color?: string;
  value: number;
};

export function ProgressBar({ color = colors.primary, value }: ProgressBarProps) {
  const normalizedValue = Math.min(1, Math.max(0, value));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ max: 100, min: 0, now: Math.round(normalizedValue * 100) }}
      style={styles.track}
    >
      <View style={[styles.fill, { backgroundColor: color, width: `${normalizedValue * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.surfaceMuted, borderRadius: radii.pill, height: 8, overflow: 'hidden' },
  fill: { borderRadius: radii.pill, height: '100%' },
});
