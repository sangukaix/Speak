import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { colors, layout, radii, spacing } from '@/theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'provider' | 'apple';

type ButtonProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: AppIconName;
  label: string;
  loading?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonVariant;
};

export function Button({
  accessibilityLabel,
  disabled = false,
  fullWidth = false,
  icon,
  label,
  loading = false,
  onPress,
  style,
  variant = 'primary',
}: ButtonProps) {
  const foreground = variant === 'primary' || variant === 'danger' || variant === 'apple'
    ? colors.white
    : variant === 'provider'
      ? colors.ink
      : colors.primary;
  const unavailable = disabled || loading;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: unavailable }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        pressed && !unavailable && styles.pressed,
        unavailable && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={foreground} size="small" /> : null}
        <AppText color={foreground} variant="label">{label}</AppText>
        {icon && !loading ? <AppIcon color={foreground} name={icon} size={19} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.xl,
    paddingVertical: 13,
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primarySoft, borderColor: colors.primary, borderWidth: 1 },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.danger },
  provider: { backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1.5 },
  apple: { backgroundColor: colors.ink },
  fullWidth: { width: '100%' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.42 },
  content: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
});
