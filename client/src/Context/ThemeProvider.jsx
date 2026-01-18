import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { COLORS, TYPOGRAPHY, UI } from '../constants';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? COLORS.accent : COLORS.primary,
            light: COLORS.accentLight,
            dark: COLORS.primaryLight,
          },
          background: {
            default: mode === 'dark' ? COLORS.backgroundDark : COLORS.backgroundLight,
            paper: mode === 'dark' ? COLORS.surfaceDark : COLORS.surfaceLight,
          },
          text: {
            primary: mode === 'dark' ? COLORS.textPrimaryDark : COLORS.textPrimaryLight,
            secondary: mode === 'dark' ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
          },
          divider: mode === 'dark' ? COLORS.borderDark : COLORS.borderLight,
          success: { main: COLORS.success },
          error: { main: COLORS.error },
          warning: { main: COLORS.warning },
        },
        typography: {
          fontFamily: TYPOGRAPHY.FONT_FAMILY,
          fontWeightRegular: TYPOGRAPHY.WEIGHT_REGULAR,
          fontWeightMedium: TYPOGRAPHY.WEIGHT_MEDIUM,
          fontWeightBold: TYPOGRAPHY.WEIGHT_SEMIBOLD,
          h1: { fontWeight: TYPOGRAPHY.WEIGHT_BOLD, fontSize: TYPOGRAPHY.SIZE_3XL },
          h2: { fontWeight: TYPOGRAPHY.WEIGHT_BOLD, fontSize: TYPOGRAPHY.SIZE_2XL },
          h3: { fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD, fontSize: TYPOGRAPHY.SIZE_XL },
          h4: { fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD, fontSize: TYPOGRAPHY.SIZE_LG },
          h5: { fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD, fontSize: TYPOGRAPHY.SIZE_BASE },
          h6: { fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD, fontSize: TYPOGRAPHY.SIZE_SM },
          body1: { fontSize: TYPOGRAPHY.SIZE_BASE },
          body2: { fontSize: TYPOGRAPHY.SIZE_SM },
          button: { fontWeight: TYPOGRAPHY.WEIGHT_MEDIUM, textTransform: 'none' },
        },
        shape: {
          borderRadius: UI.BORDER_RADIUS, // SHARP - No curves!
        },
        shadows: [
          'none',
          UI.SHADOW_SM,
          UI.SHADOW_MD,
          UI.SHADOW_LG,
          ...Array(21).fill('none'),
        ],
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: UI.BORDER_RADIUS_SM,
                padding: '10px 20px',
                fontWeight: TYPOGRAPHY.WEIGHT_MEDIUM,
                boxShadow: 'none',
                transition: `all 150ms cubic-bezier(0.4, 0, 0.2, 1)`,
                '&:hover': {
                  boxShadow: UI.SHADOW_MD,
                  transform: 'translateY(-1px)',
                },
              },
              contained: {
                backgroundColor: mode === 'dark' ? COLORS.accent : COLORS.primary,
                '&:hover': {
                  backgroundColor: mode === 'dark' ? COLORS.accentHover : COLORS.primaryLight,
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: UI.BORDER_RADIUS_SM,
                transition: `all 100ms cubic-bezier(0.4, 0, 0.2, 1)`,
                '&:hover': {
                  backgroundColor: mode === 'dark'
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(15, 23, 42, 0.05)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: UI.BORDER_RADIUS,
                backgroundImage: 'none',
              },
              elevation1: {
                boxShadow: UI.SHADOW_SM,
                border: `1px solid ${mode === 'dark' ? COLORS.borderDark : COLORS.borderLight}`,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: UI.BORDER_RADIUS_SM,
                  '& fieldset': {
                    borderColor: mode === 'dark' ? COLORS.borderDark : COLORS.borderLight,
                  },
                  '&:hover fieldset': {
                    borderColor: COLORS.accent,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: COLORS.accent,
                    borderWidth: 1,
                  },
                },
              },
            },
          },
          MuiAvatar: {
            styleOverrides: {
              root: {
                borderRadius: UI.BORDER_RADIUS_SM,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
