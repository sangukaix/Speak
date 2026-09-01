import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import type {
  SocialAuthResult,
  StartSocialAuthOptions,
} from '@/features/auth/socialAuth.types';

type ErrorWithCode = Error & { code?: string };

function randomNonce() {
  return Array.from(Crypto.getRandomBytes(32), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function callbackResult(url: string): SocialAuthResult {
  const callback = new URL(url);
  const callbackError = callback.searchParams.get('error');
  if (callbackError === 'access_denied') return { type: 'cancelled' };

  const errorDescription = callback.searchParams.get('error_description');
  if (errorDescription) throw new Error(errorDescription);

  const code = callback.searchParams.get('code');
  if (!code) throw new Error('AUTH_SOCIAL_CALLBACK_INVALID');
  return { code, type: 'code' };
}

async function signInWithNativeApple({
  client,
}: StartSocialAuthOptions): Promise<SocialAuthResult> {
  if (!(await AppleAuthentication.isAvailableAsync())) {
    throw new Error('AUTH_APPLE_NOT_AVAILABLE');
  }

  const nonce = randomNonce();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    nonce,
  );

  try {
    const credential = await AppleAuthentication.signInAsync({
      nonce: hashedNonce,
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });
    if (!credential.identityToken) throw new Error('AUTH_APPLE_TOKEN_MISSING');

    const { data, error } = await client.auth.signInWithIdToken({
      nonce,
      provider: 'apple',
      token: credential.identityToken,
    });
    if (error) throw error;
    if (!data.session) throw new Error('AUTH_SOCIAL_SESSION_MISSING');

    return { session: data.session, type: 'session' };
  } catch (error) {
    if ((error as ErrorWithCode)?.code === 'ERR_REQUEST_CANCELED') {
      return { type: 'cancelled' };
    }
    throw error;
  }
}

export async function startSocialAuth(
  options: StartSocialAuthOptions,
): Promise<SocialAuthResult> {
  if (options.provider === 'apple') {
    if (Platform.OS !== 'ios') throw new Error('AUTH_APPLE_NOT_AVAILABLE');
    return signInWithNativeApple(options);
  }

  const { data, error } = await options.client.auth.signInWithOAuth({
    provider: options.provider,
    options: {
      redirectTo: options.redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;
  if (!data.url) throw new Error('AUTH_SOCIAL_URL_MISSING');

  const result = await WebBrowser.openAuthSessionAsync(data.url, options.redirectTo);
  if (result.type === 'cancel' || result.type === 'dismiss') return { type: 'cancelled' };
  if (result.type !== 'success') throw new Error('AUTH_SOCIAL_BROWSER_FAILED');

  return callbackResult(result.url);
}
