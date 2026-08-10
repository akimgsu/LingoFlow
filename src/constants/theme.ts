// Design tokens — single source of truth for colors, spacing, radius, and shadows
export const COLORS = {
  // Deep dark backgrounds
  bgDeep: '#0A0A12',
  bgCard: '#13131F',
  bgHeader: '#0F0F1C',
  bgCardBack: '#0F0A1E',
  bgElevated: '#1A1A2E',
  bgInput: '#13131F',

  // Borders & Dividers
  border: '#1E1E30',
  borderAccent: '#2D1B69',
  borderHighlight: '#3B2D71',
  borderInput: '#26263A',

  // Brand / Violet Palette
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  primaryLight: '#8B5CF6',
  accentViolet: '#7C3AED',
  accentIndigo: '#818CF8',
  accentPurple: '#A78BFA',
  accentLavender: '#C4B5FD',

  // Category Specific Colors
  accentDaily: '#818CF8',
  accentIdioms: '#F472B6',
  accentDining: '#FB923C',
  accentWork: '#34D399',
  accentTravel: '#60A5FA',
  accentFeelings: '#A78BFA',
  accentSocial: '#F59E0B',
  accentBusiness: '#10B981',

  // Functional Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  pink: '#F472B6',
  orange: '#FB923C',
  flame: '#FB923C',
  heart: '#F472B6',

  // Typography Colors
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDim: '#475569',
  white: '#FFFFFF',
} as const;

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

export const SHADOW = {
  card: {
    ios: {
      shadowColor: '#6D28D9',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
    },
    android: { elevation: 6 },
    default: {},
  },
  cardHover: {
    ios: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35,
      shadowRadius: 24,
    },
    android: { elevation: 10 },
    default: {},
  },
  button: {
    ios: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 14,
    },
    android: { elevation: 8 },
    default: {},
  },
  avatar: {
    ios: {
      shadowColor: '#6D28D9',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
    default: {},
  },
};
