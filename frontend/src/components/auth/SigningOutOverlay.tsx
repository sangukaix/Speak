import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radii, spacing } from '@/theme/tokens';

export function SigningOutOverlay() {
  return (
    <View accessibilityLiveRegion="assertive" accessibilityViewIsModal style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator color={colors.primary} />
        <AppText variant="bodyStrong">이 기기에서 로그아웃하고 있어요</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(24, 49, 47, 0.32)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: spacing.xxl,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    gap: spacing.md,
    maxWidth: 360,
    padding: spacing.xxl,
    width: '100%',
  },
});
