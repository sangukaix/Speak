import { Pressable, StyleSheet, type StyleProp, type TextStyle } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, layout, spacing } from '@/theme/tokens';

type TextLinkProps = {
  accessibilityLabel?: string;
  label: string;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
};

export function TextLink({ accessibilityLabel, label, onPress, style }: TextLinkProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="link"
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [styles.target, pressed && styles.pressed]}
    >
      <AppText color={colors.primary} style={[styles.text, style]} variant="label">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: layout.minimumTouchTarget,
    paddingHorizontal: spacing.xs,
  },
  text: { textDecorationLine: 'underline' },
  pressed: { opacity: 0.68 },
});
