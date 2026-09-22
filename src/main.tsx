import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import type { DamageUnit } from './domain/formatHp'
import './i18n'
import { createMd3Theme, type ColorMode } from './theme/md3Theme'
import './index.css'

function Root() {
  const [mode, setMode] = useState<ColorMode>(() => {
    const saved = localStorage.getItem('dpmboss.theme')
    if (saved === 'light' || saved === 'dark') return saved
    return 'light'
  })

  const [dpmUnit, setDpmUnit] = useState<DamageUnit>(() => {
    const saved = localStorage.getItem('dpmboss.dpmUnit')
    if (saved === 'B' || saved === 'T') return saved
    return 'B'
  })

  useEffect(() => {
    localStorage.setItem('dpmboss.theme', mode)
  }, [mode])

  useEffect(() => {
    localStorage.setItem('dpmboss.dpmUnit', dpmUnit)
  }, [dpmUnit])

  const theme = useMemo(() => createMd3Theme(mode), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App
        mode={mode}
        onToggleMode={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
        dpmUnit={dpmUnit}
        onDpmUnitChange={setDpmUnit}
      />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
