import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { colors, layout, spacing } from '@/theme/tokens';

type AuthShellProps = {
  children: ReactNode;
  description: string;
  eyebrow?: string;
  footer?: ReactNode;
  onBack?: () => void;
  title: string;
};

export function AuthShell({
  children,
  description,
  eyebrow = 'SPEAK AI',
  footer,
  onBack,
  title,
}: AuthShellProps) {
  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.topRow}>
              {onBack ? <BackButton onPress={onBack} /> : <View style={styles.backPlaceholder} />}
              <View style={styles.wordmark}>
                <View style={styles.wordmarkIcon}>
                  <AppIcon color={colors.primary} name="conversation" size={20} />
                </View>
                <AppText color={colors.primary} variant="label">SPEAK AI</AppText>
              </View>
              <View style={styles.backPlaceholder} />
            </View>

            <View style={styles.heading}>
              <AppText color={colors.primary} variant="label">{eyebrow}</AppText>
              <AppText variant="title">{title}</AppText>
              <AppText color={colors.inkSoft}>{description}</AppText>
            </View>

            <Card style={styles.formCard}>{children}</Card>
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  keyboardAvoiding: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.huge,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    maxWidth: 480,
    minHeight: '100%',
    width: '100%',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xxxl,
  },
  backPlaceholder: { height: layout.minimumTouchTarget, width: layout.minimumTouchTarget },
  wordmark: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  wordmarkIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  heading: { gap: spacing.sm, marginBottom: spacing.xxl },
  formCard: { gap: spacing.lg, padding: spacing.xxl },
  footer: { alignItems: 'center', marginTop: spacing.lg },
});
