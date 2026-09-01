type AuthErrorLike = {
  code?: string;
  message?: string;
  status?: number;
};

export function getAuthErrorMessage(error: unknown, fallback: string) {
  const authError = error && typeof error === 'object' ? (error as AuthErrorLike) : undefined;
  const message = authError?.message?.toLowerCase() ?? '';

  if (authError?.status === 429 || authError?.code?.includes('rate_limit')) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
  }
  if (authError?.code === 'invalid_credentials' || message.includes('invalid login')) {
    return '이메일 또는 비밀번호를 확인해 주세요.';
  }
  if (authError?.code === 'email_not_confirmed') {
    return '이메일 확인을 마친 뒤 로그인해 주세요.';
  }
  if (authError?.code === 'weak_password') {
    return '더 길고 안전한 비밀번호를 입력해 주세요.';
  }
  if (authError?.code?.includes('flow_state') || authError?.code?.includes('pkce')) {
    return '이 링크는 요청을 시작한 기기에서 다시 열어 주세요.';
  }
  if (message.includes('provider is not enabled') || message.includes('unsupported provider')) {
    return '간편 로그인 제공자 설정이 아직 완료되지 않았습니다.';
  }
  if (message.includes('auth_apple_not_available')) {
    return '이 기기에서는 Apple 로그인을 사용할 수 없습니다.';
  }
  if (
    message.includes('auth_apple_token_missing')
    || message.includes('auth_social_callback_invalid')
    || message.includes('auth_social_session_missing')
  ) {
    return '간편 로그인 결과를 확인하지 못했습니다. 다시 시도해 주세요.';
  }
  return fallback;
}
