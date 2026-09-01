import type { SocialAuthProvider } from '@/features/auth/socialAuth.types';

export type SocialAuthButtonsProps = {
  disabled?: boolean;
  loadingProvider: SocialAuthProvider | null;
  onPress: (provider: SocialAuthProvider) => void;
};
