import type { Href } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AuthConfigurationBanner } from '@/components/auth/AuthConfigurationBanner';
import { AuthShell } from '@/components/auth/AuthShell';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { TextField } from '@/components/ui/TextField';
import { TextLink } from '@/components/ui/TextLink';
import { getAuthErrorMessage } from '@/features/auth/errors';
import { useAuth } from '@/features/auth/AuthProvider';
import type { SocialAuthProvider } from '@/features/auth/socialAuth.types';
import { validateEmail } from '@/features/auth/validation';
import { colors, spacing } from '@/theme/tokens';

export default function SignInScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ notice?: string | string[] }>();
  const { consumeNextPath, isConfigured, signIn, signInWithSocial } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [requestError, setRequestError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [socialProvider, setSocialProvider] = useState<SocialAuthProvider | null>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const notice = Array.isArray(params.notice) ? params.notice[0] : params.notice;
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const busy = submitting || socialProvider !== null;

  async function handleSocial(provider: SocialAuthProvider) {
    setRequestError(undefined);
    setSocialProvider(provider);
    try {
      const outcome = await signInWithSocial(provider);
      if (outcome === 'signedIn') {
        const next = consumeNextPath();
        router.replace((next ?? '/(tabs)') as Href);
      }
    } catch (error) {
      const providerName = provider === 'google' ? 'Google' : 'Apple';
      setRequestError(getAuthErrorMessage(
        error,
        `${providerName} 로그인을 마치지 못했습니다. 잠시 후 다시 시도해 주세요.`,
      ));
    } finally {
      setSocialProvider(null);
    }
  }

  async function handleSubmit() {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = password ? undefined : '비밀번호를 입력해 주세요.';
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setRequestError(undefined);
    if (nextEmailError) {
      emailRef.current?.focus();
      return;
    }
    if (nextPasswordError) {
      passwordRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email, password);
      const next = consumeNextPath();
      router.replace((next ?? '/(tabs)') as Href);
    } catch (error) {
      setRequestError(getAuthErrorMessage(error, '로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      description="간편 로그인이나 이메일로 학습을 이어갈 수 있습니다."
      footer={
        <View style={styles.footerLinks}>
          <TextLink label="개인정보 안내" onPress={() => router.push('/privacy')} />
          {isDevelopment ? (
            <TextLink label="인증 UI 둘러보기" onPress={() => router.push('/developer/auth-preview')} />
          ) : null}
        </View>
      }
      title="다시 이어서 연습해요"
    >
      {!isConfigured ? <AuthConfigurationBanner /> : null}
      {notice === 'password-updated' ? (
        <StatusBanner body="새 비밀번호로 다시 로그인해 주세요." title="비밀번호를 바꿨습니다" tone="success" />
      ) : null}
      {requestError ? <StatusBanner body={requestError} title="로그인을 확인해 주세요" tone="error" /> : null}

      <SocialAuthButtons
        disabled={!isConfigured || submitting}
        loadingProvider={socialProvider}
        onPress={(provider) => void handleSocial(provider)}
      />
      <View style={styles.socialNotice}>
        <AppText color={colors.inkSoft} variant="caption">
          처음 이용하는 계정은 간편 로그인 과정에서 Speak AI 계정이 만들어질 수 있습니다.
        </AppText>
        <TextLink label="개인정보 안내 확인" onPress={() => router.push('/privacy')} />
      </View>
      <View accessibilityLabel="또는 이메일로 로그인" style={styles.divider}>
        <View style={styles.dividerLine} />
        <AppText color={colors.muted} variant="caption">또는 이메일로</AppText>
        <View style={styles.dividerLine} />
      </View>

      <TextField
        autoCapitalize="none"
        autoComplete="email"
        editable={!busy}
        error={emailError}
        inputMode="email"
        keyboardType="email-address"
        label="이메일"
        onChangeText={(value) => {
          setEmail(value);
          setEmailError(undefined);
        }}
        onSubmitEditing={() => passwordRef.current?.focus()}
        placeholder="you@example.com"
        ref={emailRef}
        returnKeyType="next"
        textContentType="emailAddress"
        value={email}
      />
      <TextField
        autoComplete="current-password"
        editable={!busy}
        error={passwordError}
        label="비밀번호"
        onChangeText={(value) => {
          setPassword(value);
          setPasswordError(undefined);
        }}
        onSubmitEditing={() => void handleSubmit()}
        ref={passwordRef}
        returnKeyType="done"
        secureTextEntry
        textContentType="password"
        value={password}
      />

      <TextLink label="비밀번호를 잊었나요?" onPress={() => router.push('/auth/recovery')} />
      <Button
        disabled={!isConfigured || socialProvider !== null}
        fullWidth
        label={isConfigured ? '로그인' : '연결 후 로그인 가능'}
        loading={submitting}
        onPress={() => void handleSubmit()}
      />
      <View style={styles.joinRow}>
        <TextLink label="처음이신가요? 계정 만들기" onPress={() => router.push('/auth/sign-up')} />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  divider: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  dividerLine: { backgroundColor: colors.line, flex: 1, height: 1 },
  footerLinks: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center' },
  joinRow: { alignItems: 'center' },
  socialNotice: { alignItems: 'flex-start', gap: spacing.xs },
});
