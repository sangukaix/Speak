import type { Session, SupabaseClient } from '@supabase/supabase-js';

export type SocialAuthProvider = 'google' | 'apple';

export type SocialAuthResult =
  | { code: string; type: 'code' }
  | { session: Session; type: 'session' }
  | { type: 'cancelled' }
  | { type: 'redirecting' };

export type StartSocialAuthOptions = {
  client: SupabaseClient;
  provider: SocialAuthProvider;
  redirectTo: string;
};
