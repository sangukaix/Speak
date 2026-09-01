import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';

import { supabase } from '@/features/auth/client';
import { authConfig } from '@/features/auth/config';
import {
  clearAuthFlowContext,
  getAuthFlowContext,
  maskEmail,
  setAuthFlowContext,
  type AuthFlowIntent,
} from '@/features/auth/flowContext';
import { sanitizeNextPath } from '@/features/auth/routes';
import { startSocialAuth } from '@/features/auth/socialAuth';
import type { SocialAuthProvider } from '@/features/auth/socialAuth.types';

export type AuthStatus =
  | 'booting'
  | 'restoreError'
  | 'signedOut'
  | 'awaitingVerification'
  | 'recovering'
  | 'signedIn'
  | 'signingOut';

type AuthState = {
  emailHint?: string;
  pendingEmail?: string;
  session: Session | null;
  status: AuthStatus;
};

type AuthContextValue = {
  cancelCallback: () => Promise<void>;
  clearLocalSession: () => Promise<void>;
  completeCallback: (code: string) => Promise<AuthFlowIntent>;
  consumeNextPath: () => string | null;
  isConfigured: boolean;
  rememberNextPath: (path: string) => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  retryRestore: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithSocial: (provider: SocialAuthProvider) => Promise<SocialSignInOutcome>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  state: AuthState;
  updatePassword: (password: string) => Promise<void>;
};

export type SocialSignInOutcome = 'cancelled' | 'redirecting' | 'signedIn';

const AuthContext = createContext<AuthContextValue | null>(null);

const initialState: AuthState = { session: null, status: 'booting' };

function requireClient() {
  if (!supabase) throw new Error('AUTH_NOT_CONFIGURED');
  return supabase;
}

function callbackUrl() {
  return Linking.createURL('/auth/callback');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const nextPathRef = useRef<string | null>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const restore = useCallback(async () => {
    if (!supabase) {
      setState({ session: null, status: 'signedOut' });
      return;
    }

    setState((current) => ({ ...current, status: 'booting' }));
    try {
      const [flowContext, sessionResult] = await Promise.all([
        getAuthFlowContext(),
        supabase.auth.getSession(),
      ]);
      if (sessionResult.error) throw sessionResult.error;

      const session = sessionResult.data.session;
      if (session && flowContext?.intent === 'recovery') {
        setState({ emailHint: flowContext.emailHint, session, status: 'recovering' });
      } else if (session) {
        if (flowContext) {
          nextPathRef.current = sanitizeNextPath(flowContext.next) ?? nextPathRef.current;
          await clearAuthFlowContext();
        }
        setState({ session, status: 'signedIn' });
      } else if (flowContext?.intent === 'verification') {
        setState({ emailHint: flowContext.emailHint, session: null, status: 'awaitingVerification' });
      } else {
        setState({ session: null, status: 'signedOut' });
      }
    } catch {
      setState((current) => ({ ...current, status: 'restoreError' }));
    }
  }, []);

  useEffect(() => {
    let active = true;
    void restore();

    if (!supabase) return () => { active = false; };

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active || stateRef.current.status === 'booting') return;
      if (event === 'PASSWORD_RECOVERY' && session) {
        setState((current) => ({ ...current, session, status: 'recovering' }));
        return;
      }
      if (event === 'SIGNED_OUT') {
        setState({ session: null, status: 'signedOut' });
        return;
      }
      if (session && stateRef.current.status !== 'recovering') {
        setState({ session, status: 'signedIn' });
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [restore]);

  useEffect(() => {
    if (!supabase || Platform.OS === 'web') return;
    const client = supabase;

    if (AppState.currentState === 'active') client.auth.startAutoRefresh();
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') client.auth.startAutoRefresh();
      else client.auth.stopAutoRefresh();
    });

    return () => {
      subscription.remove();
      client.auth.stopAutoRefresh();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = requireClient();
    const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    await clearAuthFlowContext();
    setState({ session: data.session, status: 'signedIn' });
  }, []);

  const signInWithSocial = useCallback(async (
    provider: SocialAuthProvider,
  ): Promise<SocialSignInOutcome> => {
    const client = requireClient();
    await setAuthFlowContext({
      intent: 'social',
      next: nextPathRef.current ?? undefined,
      provider,
    });

    try {
      const result = await startSocialAuth({
        client,
        provider,
        redirectTo: callbackUrl(),
      });

      if (result.type === 'cancelled') {
        await clearAuthFlowContext();
        return 'cancelled';
      }
      if (result.type === 'redirecting') return 'redirecting';

      let session = result.type === 'session' ? result.session : null;
      if (result.type === 'code') {
        const { data, error } = await client.auth.exchangeCodeForSession(result.code);
        if (error) throw error;
        session = data.session;
      }
      if (!session) throw new Error('AUTH_SOCIAL_SESSION_MISSING');

      await clearAuthFlowContext();
      setState({ session, status: 'signedIn' });
      return 'signedIn';
    } catch (error) {
      await clearAuthFlowContext();
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const client = requireClient();
    const normalizedEmail = email.trim();
    await setAuthFlowContext({
      emailHint: maskEmail(normalizedEmail),
      intent: 'verification',
      next: nextPathRef.current ?? undefined,
    });

    const { error } = await client.auth.signUp({
      email: normalizedEmail,
      password,
      options: { emailRedirectTo: callbackUrl() },
    });
    if (error) {
      await clearAuthFlowContext();
      throw error;
    }

    setState({
      emailHint: maskEmail(normalizedEmail),
      pendingEmail: normalizedEmail,
      session: null,
      status: 'awaitingVerification',
    });
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    const client = requireClient();
    const normalizedEmail = email.trim();
    await setAuthFlowContext({
      emailHint: maskEmail(normalizedEmail),
      intent: 'verification',
      next: nextPathRef.current ?? undefined,
    });
    const { error } = await client.auth.resend({
      email: normalizedEmail,
      options: { emailRedirectTo: callbackUrl() },
      type: 'signup',
    });
    if (error) throw error;
    setState((current) => ({
      ...current,
      emailHint: maskEmail(normalizedEmail),
      pendingEmail: normalizedEmail,
      status: 'awaitingVerification',
    }));
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const client = requireClient();
    const normalizedEmail = email.trim();
    await setAuthFlowContext({ emailHint: maskEmail(normalizedEmail), intent: 'recovery' });
    const { error } = await client.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: callbackUrl(),
    });
    if (error) {
      await clearAuthFlowContext();
      throw error;
    }
  }, []);

  const completeCallback = useCallback(async (code: string) => {
    const client = requireClient();
    const flowContext = await getAuthFlowContext();
    if (!flowContext) throw new Error('AUTH_FLOW_CONTEXT_MISSING');

    const { data, error } = await client.auth.exchangeCodeForSession(code);
    if (error) throw error;

    if (flowContext.intent === 'recovery') {
      setState({ emailHint: flowContext.emailHint, session: data.session, status: 'recovering' });
    } else {
      await clearAuthFlowContext();
      nextPathRef.current = sanitizeNextPath(flowContext.next) ?? nextPathRef.current;
      setState({ session: data.session, status: 'signedIn' });
    }
    return flowContext.intent;
  }, []);

  const cancelCallback = useCallback(async () => {
    await clearAuthFlowContext();
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const client = requireClient();
    if (stateRef.current.status !== 'recovering') throw new Error('RECOVERY_SESSION_REQUIRED');
    const { error } = await client.auth.updateUser({ password });
    if (error) throw error;
    await clearAuthFlowContext();
    await client.auth.signOut({ scope: 'local' });
    setState({ session: null, status: 'signedOut' });
  }, []);

  const signOut = useCallback(async () => {
    const client = requireClient();
    const previous = stateRef.current;
    setState((current) => ({ ...current, status: 'signingOut' }));
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) {
      setState({ session: previous.session, status: 'signedIn' });
      throw error;
    }
    await clearAuthFlowContext();
    nextPathRef.current = null;
    setState({ session: null, status: 'signedOut' });
  }, []);

  const clearLocalSession = useCallback(async () => {
    try {
      if (supabase) await supabase.auth.signOut({ scope: 'local' });
      await clearAuthFlowContext();
    } finally {
      nextPathRef.current = null;
      setState({ session: null, status: 'signedOut' });
    }
  }, []);

  const rememberNextPath = useCallback((path: string) => {
    const safePath = sanitizeNextPath(path);
    if (safePath) nextPathRef.current = safePath;
  }, []);

  const consumeNextPath = useCallback(() => {
    const path = nextPathRef.current;
    nextPathRef.current = null;
    return path;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    cancelCallback,
    clearLocalSession,
    completeCallback,
    consumeNextPath,
    isConfigured: authConfig.isConfigured,
    rememberNextPath,
    requestPasswordReset,
    resendVerification,
    retryRestore: restore,
    signIn,
    signInWithSocial,
    signOut,
    signUp,
    state,
    updatePassword,
  }), [
    cancelCallback,
    clearLocalSession,
    completeCallback,
    consumeNextPath,
    rememberNextPath,
    requestPasswordReset,
    resendVerification,
    restore,
    signIn,
    signInWithSocial,
    signOut,
    signUp,
    state,
    updatePassword,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
