import { sessionStorage } from '@/features/auth/sessionStorage';

import type { SocialAuthProvider } from '@/features/auth/socialAuth.types';

export type AuthFlowIntent = 'verification' | 'recovery' | 'social';

export type AuthFlowContext = {
  createdAt: number;
  emailHint?: string;
  intent: AuthFlowIntent;
  next?: string;
  provider?: SocialAuthProvider;
};

const flowContextKey = 'speak-ai-auth-flow-context';
const maximumFlowAgeMs = 24 * 60 * 60 * 1000;

export async function clearAuthFlowContext() {
  await sessionStorage.removeItem(flowContextKey);
}

export async function getAuthFlowContext() {
  const raw = await sessionStorage.getItem(flowContextKey);
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<AuthFlowContext>;
    const validIntent = value.intent === 'verification'
      || value.intent === 'recovery'
      || value.intent === 'social';
    const validProvider = value.intent !== 'social'
      || value.provider === 'google'
      || value.provider === 'apple';
    const validTimestamp = typeof value.createdAt === 'number' && Date.now() - value.createdAt <= maximumFlowAgeMs;
    if (!validIntent || !validProvider || !validTimestamp) {
      await clearAuthFlowContext();
      return null;
    }
    return value as AuthFlowContext;
  } catch {
    await clearAuthFlowContext();
    return null;
  }
}

export async function setAuthFlowContext(context: Omit<AuthFlowContext, 'createdAt'>) {
  await sessionStorage.setItem(
    flowContextKey,
    JSON.stringify({ ...context, createdAt: Date.now() } satisfies AuthFlowContext),
  );
}

export function maskEmail(email: string) {
  const [name, domain] = email.trim().split('@');
  if (!name || !domain) return '입력한 이메일';
  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}${'*'.repeat(Math.max(2, name.length - visible.length))}@${domain}`;
}
