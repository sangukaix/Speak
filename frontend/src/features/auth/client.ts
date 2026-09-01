import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import { authConfig } from '@/features/auth/config';
import { sessionStorage } from '@/features/auth/sessionStorage';

export const supabase = authConfig.isConfigured
  ? createClient(authConfig.url, authConfig.publishableKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
        persistSession: true,
        storage: sessionStorage,
      },
    })
  : null;
