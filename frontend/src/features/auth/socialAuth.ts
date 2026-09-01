import type {
  SocialAuthResult,
  StartSocialAuthOptions,
} from '@/features/auth/socialAuth.types';

export async function startSocialAuth({
  client,
  provider,
  redirectTo,
}: StartSocialAuthOptions): Promise<SocialAuthResult> {
  const { error } = await client.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) throw error;

  return { type: 'redirecting' };
}
