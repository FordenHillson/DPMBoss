import { createTheme } from '@mui/material/styles'

export type ColorMode = 'light' | 'dark'

/**
 * Colors from dark-mode-palette.css
 * Light: bg #FFFFFF / surface #F1F5F9 / primary #3B82F6 / secondary #8B5CF6 / text #0F172A
 * Dark:  bg #121212 / surface #1c1e20 / primary #7faaef / secondary #7646e3 / text #e0e2e5
 */
export function createMd3Theme(mode: ColorMode) {
  const isLight = mode === 'light'

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: isLight ? '#3B82F6' : '#7faaef',
        contrastText: isLight ? '#FFFFFF' : '#0F172A',
      },
      secondary: {
        main: isLight ? '#8B5CF6' : '#7646e3',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isLight ? '#FFFFFF' : '#121212',
        paper: isLight ? '#F1F5F9' : '#1c1e20',
      },
      text: {
        primary: isLight ? '#0F172A' : '#e0e2e5',
        secondary: isLight ? '#475569' : '#a8adb4',
      },
      divider: isLight ? '#E2E8F0' : '#2a2d31',
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Roboto", "Noto Sans Thai", "Helvetica", "Arial", sans-serif',
      h5: { fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isLight ? '#FFFFFF' : '#121212',
            color: isLight ? '#0F172A' : '#e0e2e5',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: isLight
            ? undefined
            : {
                // Dark mode: soft blue bar reads cleaner than pale lavender
                backgroundColor: '#1c1e20',
                color: '#e0e2e5',
                borderBottom: '1px solid #2a2d31',
              },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
      },
    },
  })
}
