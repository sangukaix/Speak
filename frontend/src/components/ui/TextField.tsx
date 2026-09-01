import { forwardRef, useId, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppText } from '@/components/ui/AppText';
import { colors, layout, radii, spacing } from '@/theme/tokens';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  error?: string;
  hint?: string;
  label: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { error, hint, label, secureTextEntry = false, ...props },
  ref,
) {
  const id = useId().replace(/:/g, '');
  const [revealed, setRevealed] = useState(false);
  const helpId = `${id}-help`;
  const isSecure = secureTextEntry && !revealed;

  return (
    <View style={styles.field}>
      <AppText nativeID={`${id}-label`} variant="label">{label}</AppText>
      <View style={[styles.inputFrame, error && styles.inputFrameError]}>
        <TextInput
          {...props}
          ref={ref}
          accessibilityLabel={label}
          aria-describedby={error || hint ? helpId : undefined}
          aria-invalid={Boolean(error)}
          placeholderTextColor={colors.muted}
          secureTextEntry={isSecure}
          style={styles.input}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityLabel={revealed ? '비밀번호 숨기기' : '비밀번호 보기'}
            accessibilityRole="button"
            hitSlop={4}
            onPress={() => setRevealed((current) => !current)}
            style={({ pressed }) => [styles.visibilityButton, pressed && styles.pressed]}
          >
            <AppIcon color={colors.inkSoft} name={revealed ? 'eyeOff' : 'eye'} size={21} />
          </Pressable>
        ) : null}
      </View>
      {error || hint ? (
        <AppText
          accessibilityLiveRegion={error ? 'polite' : 'none'}
          color={error ? colors.danger : colors.inkSoft}
          nativeID={helpId}
          variant="caption"
        >
          {error ?? hint}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  inputFrame: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    minHeight: 52,
  },
  inputFrameError: { borderColor: colors.danger },
  input: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  visibilityButton: {
    alignItems: 'center',
    height: layout.minimumTouchTarget,
    justifyContent: 'center',
    marginRight: spacing.xs,
    width: layout.minimumTouchTarget,
  },
  pressed: { opacity: 0.65 },
});
