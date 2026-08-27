export const colors = {
  background: '#F4F4EF',
  surface: '#FFFFFF',
  surfaceMuted: '#EDEEE8',
  ink: '#18312F',
  inkSoft: '#425B57',
  muted: '#6D7E7A',
  line: '#D9DFDA',
  primary: '#176B5B',
  primaryPressed: '#105447',
  primarySoft: '#DCEDE7',
  accent: '#F17457',
  accentSoft: '#FDE6DF',
  sunshine: '#F3C95D',
  sunshineSoft: '#FFF4CF',
  success: '#23845F',
  successSoft: '#DDF1E7',
  danger: '#B95252',
  white: '#FFFFFF',
  overlay: 'rgba(24, 49, 47, 0.08)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 44,
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const layout = {
  maxContentWidth: 760,
  screenPadding: 20,
  wideScreenPadding: 32,
  minimumTouchTarget: 44,
} as const;

const cardShadow = Platform.select<ViewStyle>({
  web: { boxShadow: '0 8px 18px rgba(24, 49, 47, 0.06)' },
  default: {
    elevation: 2,
    shadowColor: '#18312F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
  },
});

export const shadows = { card: cardShadow } as const;
import { Platform, type ViewStyle } from 'react-native';
