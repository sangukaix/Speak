import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { AuthConfigurationBanner } from '@/components/auth/AuthConfigurationBanner';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/features/auth/AuthProvider';
import { getAuthErrorMessage } from '@/features/auth/errors';
import { validatePassword } from '@/features/auth/validation';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { isConfigured, state, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [passwordError, setPasswordError] = useState<string>();
  const [confirmationError, setConfirmationError] = useState<string>();
  const [requestError, setRequestError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const confirmationRef = useRef<TextInput>(null);
  const canSubmit = isConfigured && state.status === 'recovering';

  async function handleSubmit() {
    const nextPasswordError = validatePassword(password);
    const nextConfirmationError = password === confirmation ? undefined : '비밀번호가 서로 다릅니다.';
    setPasswordError(nextPasswordError);
    setConfirmationError(nextConfirmationError);
    setRequestError(undefined);
    if (nextPasswordError) {
      passwordRef.current?.focus();
      return;
    }
    if (nextConfirmationError) {
      confirmationRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      router.replace({ pathname: '/auth/sign-in', params: { notice: 'password-updated' } });
    } catch (error) {
      setRequestError(getAuthErrorMessage(error, '비밀번호를 바꾸지 못했습니다. 재설정 메일을 다시 요청해 주세요.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      description="새 비밀번호를 저장한 뒤 모든 기기에서 다시 로그인합니다."
      title="새 비밀번호 만들기"
    >
      {!isConfigured ? <AuthConfigurationBanner /> : null}
      {state.status !== 'recovering' ? (
        <StatusBanner
          body="실제 변경은 이메일의 유효한 재설정 링크로 들어왔을 때만 가능합니다."
          title="지금은 화면 미리보기 상태입니다"
          tone="warning"
        />
      ) : null}
      {requestError ? <StatusBanner body={requestError} title="변경을 완료하지 못했습니다" tone="error" /> : null}

      <TextField
        autoComplete="new-password"
        error={passwordError}
        hint="15–64자. 다른 서비스에서 쓰지 않은 긴 비밀번호를 권장합니다."
        label="새 비밀번호"
        onChangeText={(value) => {
          setPassword(value);
          setPasswordError(undefined);
        }}
        onSubmitEditing={() => confirmationRef.current?.focus()}
        ref={passwordRef}
        returnKeyType="next"
        secureTextEntry
        textContentType="newPassword"
        value={password}
      />
      <TextField
        autoComplete="new-password"
        error={confirmationError}
        label="새 비밀번호 확인"
        onChangeText={(value) => {
          setConfirmation(value);
          setConfirmationError(undefined);
        }}
        onSubmitEditing={() => void handleSubmit()}
        ref={confirmationRef}
        returnKeyType="done"
        secureTextEntry
        textContentType="newPassword"
        value={confirmation}
      />
      <Button
        disabled={!canSubmit}
        fullWidth
        label={canSubmit ? '비밀번호 변경' : '재설정 링크에서 변경 가능'}
        loading={submitting}
        onPress={() => void handleSubmit()}
      />
    </AuthShell>
  );
}
