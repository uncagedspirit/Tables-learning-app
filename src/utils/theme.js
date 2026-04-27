export const colors = {
  bg: '#0A0A0F',
  surface: '#13131A',
  surfaceAlt: '#1C1C27',
  border: '#2A2A3A',
  borderLight: '#333348',

  primary: '#6C63FF',
  primaryDim: '#3D3880',
  primaryGlow: 'rgba(108, 99, 255, 0.18)',

  success: '#22D3A5',
  successDim: 'rgba(34, 211, 165, 0.15)',
  successGlow: 'rgba(34, 211, 165, 0.08)',

  error: '#FF5C7A',
  errorDim: 'rgba(255, 92, 122, 0.15)',
  errorGlow: 'rgba(255, 92, 122, 0.08)',

  warn: '#FFB547',
  warnDim: 'rgba(255, 181, 71, 0.15)',

  text: '#F0F0FA',
  textSecondary: '#8888AA',
  textMuted: '#55556A',

  streak: '#FF9F43',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const typography = {
  display: {
    fontFamily: 'System',
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -2,
    color: colors.text,
  },
  heading: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.8,
    color: colors.text,
  },
  subheading: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: colors.text,
  },
  body: {
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  label: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  mono: {
    fontFamily: 'Courier New',
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    color: colors.text,
  },
};
