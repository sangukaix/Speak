import type { ReactNode } from 'react';
import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { colors } from '@/theme/tokens';

type TextVariant = 'display' | 'title' | 'heading' | 'subheading' | 'body' | 'bodyStrong' | 'label' | 'caption';

type AppTextProps = TextProps & {
  children: ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>;
  variant?: TextVariant;
};

export function AppText({ children, color, style, variant = 'body', ...props }: AppTextProps) {
  return (
    <Text {...props} style={[styles.base, styles[variant], color ? { color } : undefined, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { color: colors.ink },
  display: { fontSize: 38, fontWeight: '800', letterSpacing: -1.4, lineHeight: 44 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.9, lineHeight: 37 },
  heading: { fontSize: 22, fontWeight: '800', letterSpacing: -0.45, lineHeight: 29 },
  subheading: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2, lineHeight: 25 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyStrong: { fontSize: 16, fontWeight: '700', lineHeight: 24 },
  label: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '500', lineHeight: 19 },
});
