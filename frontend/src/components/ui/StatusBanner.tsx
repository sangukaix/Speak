import { StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { colors, radii, spacing } from '@/theme/tokens';

type StatusTone = 'info' | 'success' | 'warning' | 'error';

type StatusBannerProps = {
  body: string;
  title: string;
  tone?: StatusTone;
};

const toneTokens: Record<StatusTone, { background: string; foreground: string; icon: AppIconName }> = {
  info: { background: colors.primarySoft, foreground: colors.primary, icon: 'info' },
  success: { background: colors.successSoft, foreground: colors.success, icon: 'check' },
  warning: { background: colors.sunshineSoft, foreground: colors.inkSoft, icon: 'warning' },
  error: { background: colors.dangerSoft, foreground: colors.danger, icon: 'warning' },
};

export function StatusBanner({ body, title, tone = 'info' }: StatusBannerProps) {
  const token = toneTokens[tone];

  return (
    <View
      accessibilityLiveRegion={tone === 'error' ? 'assertive' : 'polite'}
      accessibilityRole={tone === 'error' ? 'alert' : undefined}
      style={[styles.banner, { backgroundColor: token.background }]}
    >
      <AppIcon color={token.foreground} name={token.icon} size={21} />
      <View style={styles.copy}>
        <AppText color={token.foreground} variant="bodyStrong">{title}</AppText>
        <AppText color={colors.inkSoft} variant="caption">{body}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'flex-start',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  copy: { flex: 1, gap: spacing.xs },
});
