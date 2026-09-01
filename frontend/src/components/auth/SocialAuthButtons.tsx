import { StyleSheet, View } from 'react-native';

import type { SocialAuthButtonsProps } from '@/components/auth/SocialAuthButtons.types';
import { Button } from '@/components/ui/Button';
import { spacing } from '@/theme/tokens';

export function SocialAuthButtons({
  disabled = false,
  loadingProvider,
  onPress,
}: SocialAuthButtonsProps) {
  const busy = loadingProvider !== null;

  return (
    <View accessibilityLabel="간편 로그인" style={styles.group}>
      <Button
        disabled={disabled || busy}
        fullWidth
        label={loadingProvider === 'google' ? 'Google 연결 중' : 'Google로 계속하기'}
        loading={loadingProvider === 'google'}
        onPress={() => onPress('google')}
        variant="provider"
      />
      <Button
        disabled={disabled || busy}
        fullWidth
        label={loadingProvider === 'apple' ? 'Apple 연결 중' : 'Apple로 계속하기'}
        loading={loadingProvider === 'apple'}
        onPress={() => onPress('apple')}
        variant="apple"
      />
    </View>
  );
}

const styles = StyleSheet.create({ group: { gap: spacing.md } });
