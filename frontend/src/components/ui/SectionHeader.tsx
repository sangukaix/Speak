import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, spacing } from '@/theme/tokens';

type SectionHeaderProps = {
  description?: string;
  eyebrow?: string;
  title: string;
};

export function SectionHeader({ description, eyebrow, title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? (
        <AppText color={colors.primary} style={styles.eyebrow} variant="caption">
          {eyebrow}
        </AppText>
      ) : null}
      <AppText variant="heading">{title}</AppText>
      {description ? (
        <AppText color={colors.muted} style={styles.description}>
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  eyebrow: { fontWeight: '800', letterSpacing: 0.7, textTransform: 'uppercase' },
  description: { marginTop: spacing.xs },
});
