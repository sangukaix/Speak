import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

import { AuthConfigurationBanner } from '@/components/auth/AuthConfigurationBanner';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { TextField } from '@/components/ui/TextField';
import { TextLink } from '@/components/ui/TextLink';
import { useAuth } from '@/features/auth/AuthProvider';
import { getAuthErrorMessage } from '@/features/auth/errors';
import { validateEmail } from '@/features/auth/validation';

export default function RecoveryScreen() {
  const router = useRouter();
  const { isConfigured, requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [requestError, setRequestError] = useState<string>();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<TextInput>(null);

  async function handleSubmit() {
    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);
    setRequestError(undefined);
    if (nextEmailError) {
      emailRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (error) {
      setRequestError(getAuthErrorMessage(error, '재설정 안내를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      description="입력한 주소의 계정이 있으면 비밀번호 재설정 안내를 보냅니다."
      onBack={() => router.back()}
      title="비밀번호 재설정"
    >
      {!isConfigured ? <AuthConfigurationBanner /> : null}
      {sent ? (
        <>
          <StatusBanner
            body="메일이 오지 않으면 주소와 스팸함을 확인해 주세요."
            title="계정이 있는 주소라면 재설정 안내가 전송됩니다"
            tone="success"
          />
          <Button fullWidth label="로그인으로 돌아가기" onPress={() => router.replace('/auth/sign-in')} />
        </>
      ) : (
        <>
          {requestError ? <StatusBanner body={requestError} title="요청을 완료하지 못했습니다" tone="error" /> : null}
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
            onSubmitEditing={() => void handleSubmit()}
            placeholder="you@example.com"
            ref={emailRef}
            returnKeyType="send"
            textContentType="emailAddress"
            value={email}
          />
          <Button
            disabled={!isConfigured}
            fullWidth
            label={isConfigured ? '재설정 안내 받기' : '연결 후 요청 가능'}
            loading={submitting}
            onPress={() => void handleSubmit()}
          />
          <View style={styles.centeredLink}>
            <TextLink label="로그인으로 돌아가기" onPress={() => router.replace('/auth/sign-in')} />
          </View>
        </>
      )}
    </AuthShell>
  );
}

const styles = StyleSheet.create({ centeredLink: { alignItems: 'center' } });
