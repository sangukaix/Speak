const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string) {
  if (!email.trim()) return '이메일을 입력해 주세요.';
  if (!basicEmailPattern.test(email.trim())) return '이메일 형식을 확인해 주세요.';
  return undefined;
}

export function validatePassword(password: string) {
  if (!password) return '비밀번호를 입력해 주세요.';
  if (password.length < 15) return '비밀번호는 15자 이상이어야 합니다.';
  if (password.length > 64) return '비밀번호는 64자 이하로 입력해 주세요.';
  return undefined;
}
