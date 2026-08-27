import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radii, spacing } from '@/theme/tokens';

type DemoBadgeProps = {
  inverse?: boolean;
  label?: string;
};

export function DemoBadge({ inverse = false, label = '데모 콘텐츠' }: DemoBadgeProps) {
  return (
    <View style={[styles.badge, inverse && styles.inverseBadge]}>
      <AppText color={inverse ? colors.white : colors.primary} style={styles.text} variant="caption">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  inverseBadge: { backgroundColor: 'rgba(255,255,255,0.18)' },
  text: { fontSize: 11, fontWeight: '800', letterSpacing: 0.4, lineHeight: 16 },
});
