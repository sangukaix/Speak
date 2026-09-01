import { StatusBanner } from '@/components/ui/StatusBanner';

export function AuthConfigurationBanner() {
  return (
    <StatusBanner
      body="Supabase 개발 프로젝트와 공개 설정값이 필요합니다. 간편 로그인은 Google·Apple 제공자 설정까지 마친 뒤 동작합니다. 현재는 UI·이동 흐름 검토 단계입니다."
      title="인증 서버 연결 전입니다"
      tone="warning"
    />
  );
}
