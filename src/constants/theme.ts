// Design tokens — single source of truth for colors, spacing, radius
export const COLORS = {
  // Background layers
  bgDeep: '#0A0A12',
  bgCard: '#13131F',
  bgHeader: '#0F0F1C',
  bgCardBack: '#0F0A1E',

  // Borders
  border: '#1E1E30',
  borderAccent: '#2D1B69',

  // Brand / accent
  violet: '#6D28D9',
  violetLight: '#7C3AED',
  indigo: '#818CF8',
  purple: '#A78BFA',

  // Category accents
  accentDaily: '#818CF8',
  accentIdioms: '#F472B6',
  accentDining: '#FB923C',
  accentWork: '#34D399',
  accentTravel: '#60A5FA',
  accentFeelings: '#A78BFA',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#4B5563',
  textDim: '#374151',

  // Status
  pink: '#F472B6',
  orange: '#FB923C',
  white: '#FFFFFF',
} as const;

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const SHADOW = {
  card: {
    ios: {
      shadowColor: '#6D28D9',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
  },
  button: {
    ios: {
      shadowColor: '#6D28D9',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
    },
    android: { elevation: 6 },
  },
  avatar: {
    ios: {
      shadowColor: '#6D28D9',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
  },
} as const;
