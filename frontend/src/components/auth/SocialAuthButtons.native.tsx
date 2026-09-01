import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform, StyleSheet, View } from 'react-native';

import type { SocialAuthButtonsProps } from '@/components/auth/SocialAuthButtons.types';
import { Button } from '@/components/ui/Button';
import { layout, radii, spacing } from '@/theme/tokens';

export function SocialAuthButtons({
  disabled = false,
  loadingProvider,
  onPress,
}: SocialAuthButtonsProps) {
  const busy = loadingProvider !== null;
  const useNativeAppleButton = Platform.OS === 'ios' && !disabled && !busy;

  return (
    <View accessibilityLabel="간편 로그인" style={styles.group}>
      {Platform.OS === 'ios' ? (
        useNativeAppleButton ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            cornerRadius={radii.md}
            onPress={() => onPress('apple')}
            style={styles.appleButton}
          />
        ) : (
          <Button
            disabled={disabled || busy}
            fullWidth
            label={loadingProvider === 'apple' ? 'Apple 연결 중' : 'Apple로 계속하기'}
            loading={loadingProvider === 'apple'}
            onPress={() => onPress('apple')}
            variant="apple"
          />
        )
      ) : null}
      <Button
        disabled={disabled || busy}
        fullWidth
        label={loadingProvider === 'google' ? 'Google 연결 중' : 'Google로 계속하기'}
        loading={loadingProvider === 'google'}
        onPress={() => onPress('google')}
        variant="provider"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.md },
  appleButton: { height: Math.max(50, layout.minimumTouchTarget), width: '100%' },
});
