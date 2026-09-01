import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { colors, radii, spacing } from '@/theme/tokens';

type AuthLoadingScreenProps = {
  message?: string;
};

export function AuthLoadingScreen({ message = '로그인 상태를 안전하게 확인하고 있어요.' }: AuthLoadingScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View accessibilityLiveRegion="polite" style={styles.content}>
        <View style={styles.iconFrame}>
          <AppIcon color={colors.primary} name="conversation" size={34} />
        </View>
        <View style={styles.copy}>
          <AppText color={colors.primary} variant="label">SPEAK AI</AppText>
          <AppText variant="heading">연습을 준비하고 있어요</AppText>
          <AppText color={colors.inkSoft} style={styles.message}>{message}</AppText>
        </View>
        <ActivityIndicator color={colors.primary} size="small" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  content: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xxl,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.xl,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  copy: { alignItems: 'center', gap: spacing.sm, maxWidth: 360 },
  message: { textAlign: 'center' },
});
