import { createTheme } from '@mui/material/styles'

export type ColorMode = 'light' | 'dark'

export function createMd3Theme(mode: ColorMode) {
  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#6750A4' : '#D0BCFF',
      },
      secondary: {
        main: mode === 'light' ? '#625B71' : '#CCC2DC',
      },
      background: {
        default: mode === 'light' ? '#FEF7FF' : '#141218',
        paper: mode === 'light' ? '#FFFBFE' : '#1D1B20',
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Roboto", "Noto Sans Thai", "Helvetica", "Arial", sans-serif',
      h5: { fontWeight: 600 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
      },
    },
  })
}
