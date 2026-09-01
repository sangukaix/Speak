const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';

export const authConfig = {
  isConfigured: Boolean(supabaseUrl && supabasePublishableKey),
  publishableKey: supabasePublishableKey,
  url: supabaseUrl,
} as const;
