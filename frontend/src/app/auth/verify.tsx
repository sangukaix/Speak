import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AuthConfigurationBanner } from '@/components/auth/AuthConfigurationBanner';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { TextField } from '@/components/ui/TextField';
import { TextLink } from '@/components/ui/TextLink';
import { useAuth } from '@/features/auth/AuthProvider';
import { getAuthErrorMessage } from '@/features/auth/errors';
import { validateEmail } from '@/features/auth/validation';
import { spacing } from '@/theme/tokens';

const resendCooldownSeconds = 60;

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { isConfigured, resendVerification, state } = useAuth();
  const [email, setEmail] = useState(state.pendingEmail ?? '');
  const [emailError, setEmailError] = useState<string>();
  const [requestError, setRequestError] = useState<string>();
  const [sentAgain, setSentAgain] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const emailHint = state.emailHint ?? (process.env.NODE_ENV !== 'production' ? 'sa****@example.com' : '입력한 이메일');

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((current) => Math.max(0, current - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleResend() {
    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);
    setRequestError(undefined);
    setSentAgain(false);
    if (nextEmailError) {
      emailRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await resendVerification(email);
      setSentAgain(true);
      setCooldown(resendCooldownSeconds);
    } catch (error) {
      setRequestError(getAuthErrorMessage(error, '확인 메일을 다시 보내지 못했습니다. 잠시 후 다시 시도해 주세요.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      description={`${emailHint} 주소로 보낸 링크를 열면 가입이 완료됩니다.`}
      onBack={() => router.replace('/auth/sign-in')}
      title="이메일을 확인해 주세요"
    >
      {!isConfigured ? <AuthConfigurationBanner /> : null}
      <StatusBanner
        body="링크는 한 번만 사용하고, 만료되었거나 이미 사용했다면 새 메일을 요청해 주세요."
        title="메일 속 확인 링크를 열어 주세요"
      />
      {sentAgain ? (
        <StatusBanner body="새로 도착한 메일의 링크를 사용해 주세요." title="확인 메일을 다시 보냈습니다" tone="success" />
      ) : null}
      {requestError ? <StatusBanner body={requestError} title="재전송을 완료하지 못했습니다" tone="error" /> : null}

      <TextField
        autoCapitalize="none"
        autoComplete="email"
        error={emailError}
        inputMode="email"
        keyboardType="email-address"
        label="확인 메일을 받을 이메일"
        onChangeText={(value) => {
          setEmail(value);
          setEmailError(undefined);
          setSentAgain(false);
        }}
        onSubmitEditing={() => void handleResend()}
        placeholder="you@example.com"
        ref={emailRef}
        returnKeyType="send"
        textContentType="emailAddress"
        value={email}
      />

      <Button
        disabled={!isConfigured || cooldown > 0}
        fullWidth
        label={!isConfigured ? '연결 후 재전송 가능' : cooldown > 0 ? `${cooldown}초 후 다시 보내기` : '확인 메일 다시 보내기'}
        loading={submitting}
        onPress={() => void handleResend()}
        variant="secondary"
      />
      <View style={styles.links}>
        <TextLink label="이메일을 잘못 입력했나요? 다시 가입하기" onPress={() => router.replace('/auth/sign-up')} />
        <TextLink label="이미 확인했나요? 로그인" onPress={() => router.replace('/auth/sign-in')} />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({ links: { alignItems: 'center', gap: spacing.sm } });
