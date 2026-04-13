// DevForge Theme — Dark IDE with Cyan/Teal accent
export const theme = {
  // Primary palette
  primary: '#00D4AA',
  primaryLight: '#33DFBB',
  primaryDark: '#00A888',
  
  // AI accent
  accent: '#7C3AED',
  accentLight: '#A78BFA',
  accentDark: '#5B21B6',

  // Backgrounds
  background: '#0D1117',
  backgroundSecondary: '#161B22',
  surface: '#1C2333',
  surfaceElevated: '#21293B',

  // Text
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  textMuted: '#484F58',
  textInverse: '#0D1117',

  // Borders
  border: '#30363D',
  borderLight: '#21262D',

  // Semantic
  success: '#3FB950',
  error: '#F85149',
  warning: '#D29922',
  info: '#58A6FF',

  // Syntax colors
  syntax: {
    keyword: '#FF7B72',
    string: '#A5D6FF',
    comment: '#8B949E',
    function: '#D2A8FF',
    number: '#79C0FF',
    operator: '#FF7B72',
    variable: '#FFA657',
    type: '#7EE787',
    bracket: '#E6EDF3',
  },

  // Language colors
  languages: {
    javascript: '#F1E05A',
    typescript: '#3178C6',
    python: '#3572A5',
    rust: '#DEA584',
    go: '#00ADD8',
    html: '#E34C26',
    css: '#563D7C',
    shell: '#89E051',
    markdown: '#083FA1',
    json: '#292929',
  } as Record<string, string>,

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Border radius
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // Typography
  typography: {
    heroValue: { fontSize: 48, fontWeight: '700' as const, color: '#00D4AA' },
    heroLabel: { fontSize: 11, fontWeight: '600' as const, color: '#8B949E', textTransform: 'uppercase' as const, letterSpacing: 1 },
    title: { fontSize: 24, fontWeight: '700' as const, color: '#E6EDF3' },
    subtitle: { fontSize: 18, fontWeight: '600' as const, color: '#E6EDF3' },
    body: { fontSize: 15, fontWeight: '400' as const, color: '#E6EDF3' },
    bodySmall: { fontSize: 13, fontWeight: '400' as const, color: '#8B949E' },
    caption: { fontSize: 11, fontWeight: '500' as const, color: '#8B949E' },
    code: { fontSize: 14, fontFamily: 'monospace' as const, color: '#E6EDF3' },
    codeLarge: { fontSize: 16, fontFamily: 'monospace' as const, color: '#E6EDF3' },
    sectionHeader: { fontSize: 13, fontWeight: '600' as const, color: '#8B949E', textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  },

  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};
