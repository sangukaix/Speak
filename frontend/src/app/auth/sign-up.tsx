import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AuthConfigurationBanner } from '@/components/auth/AuthConfigurationBanner';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { TextField } from '@/components/ui/TextField';
import { TextLink } from '@/components/ui/TextLink';
import { useAuth } from '@/features/auth/AuthProvider';
import { getAuthErrorMessage } from '@/features/auth/errors';
import { validateEmail, validatePassword } from '@/features/auth/validation';
import { spacing } from '@/theme/tokens';

export default function SignUpScreen() {
  const router = useRouter();
  const { isConfigured, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [requestError, setRequestError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  async function handleSubmit() {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setRequestError(acceptedPrivacy ? undefined : '계정을 만들려면 개인정보 안내를 먼저 확인해 주세요.');

    if (nextEmailError) {
      emailRef.current?.focus();
      return;
    }
    if (nextPasswordError) {
      passwordRef.current?.focus();
      return;
    }
    if (!acceptedPrivacy) return;

    setSubmitting(true);
    try {
      await signUp(email, password);
      router.replace('/auth/verify');
    } catch (error) {
      setRequestError(getAuthErrorMessage(error, '계정을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      description="이메일 확인을 마치면 현재 데모 학습 화면을 이용할 수 있습니다."
      onBack={() => router.back()}
      title="내 학습을 이어갈 계정 만들기"
    >
      {!isConfigured ? <AuthConfigurationBanner /> : null}
      <StatusBanner
        body="계정을 만들어도 학습 기록 저장, AI, 음성 기능은 아직 연결되지 않습니다."
        title="현재 개발 범위 안내"
      />
      {requestError ? <StatusBanner body={requestError} title="입력을 확인해 주세요" tone="error" /> : null}

      <TextField
        autoCapitalize="none"
        autoComplete="email"
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
        autoComplete="new-password"
        error={passwordError}
        hint="15–64자. 문장처럼 길게 만들 수 있고 붙여넣기와 비밀번호 관리자를 지원합니다."
        label="비밀번호"
        onChangeText={(value) => {
          setPassword(value);
          setPasswordError(undefined);
        }}
        onSubmitEditing={() => void handleSubmit()}
        ref={passwordRef}
        returnKeyType="done"
        secureTextEntry
        textContentType="newPassword"
        value={password}
      />

      <View style={styles.privacyGroup}>
        <Checkbox
          checked={acceptedPrivacy}
          label="개인정보 수집·이용 안내를 확인했습니다."
          onChange={(checked) => {
            setAcceptedPrivacy(checked);
            if (checked) setRequestError(undefined);
          }}
        />
        <TextLink label="개인정보 안내 전문 보기" onPress={() => router.push('/privacy')} />
      </View>

      <Button
        disabled={!isConfigured}
        fullWidth
        label={isConfigured ? '계정 만들기' : '연결 후 계정 생성 가능'}
        loading={submitting}
        onPress={() => void handleSubmit()}
      />
      <View style={styles.centeredLink}>
        <TextLink label="이미 계정이 있나요? 로그인" onPress={() => router.replace('/auth/sign-in')} />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  privacyGroup: { gap: spacing.xs },
  centeredLink: { alignItems: 'center' },
});
