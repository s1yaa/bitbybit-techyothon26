export const colors = {
  bg: {
    dark: '#0e0e0e',
    card: '#1a1a1a',
    surface: '#232323',
    overlay: 'rgba(0,0,0,0.6)',
  },

  green: {
    primary: '#7DB87A',
    light: '#9FD09C',
    dim: 'rgba(125,184,122,0.15)',
  },

  category: {
    wet: '#5B9E50',
    dry: '#4A90C4',
    recyclable: '#EAB45C',
    hazardous: '#C94B4B',
    ewaste: '#7F77DD',
  },

  text: {
    primary: '#F5F5F5',
    secondary: '#A0A0A0',
    muted: '#5A5A5A',
  },

  border: 'rgba(255,255,255,0.08)',
  white: '#FFFFFF',
  black: '#000000',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
} as const

export const fonts = {
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
} as const