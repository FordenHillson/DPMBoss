import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import TranslateIcon from '@mui/icons-material/Translate'
import {
  AppBar,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { DamageUnit } from '../domain/formatHp'

type Props = {
  mode: 'light' | 'dark'
  onToggleMode: () => void
  dpmUnit: DamageUnit
  onDpmUnitChange: (unit: DamageUnit) => void
}

export function AppBarSettings({
  mode,
  onToggleMode,
  dpmUnit,
  onDpmUnitChange,
}: Props) {
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    const next = i18n.language === 'th' ? 'en' : 'th'
    void i18n.changeLanguage(next)
    localStorage.setItem('dpmboss.lang', next)
  }

  return (
    <AppBar position="sticky" color="primary" enableColorOnDark>
      <Toolbar sx={{ gap: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {t('app.title')}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Tooltip title={t('settings.dpmUnit')}>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={dpmUnit}
              onChange={(_, value: DamageUnit | null) => {
                if (value) onDpmUnitChange(value)
              }}
              aria-label={t('settings.dpmUnit')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.12)',
                '& .MuiToggleButton-root': {
                  color: 'inherit',
                  borderColor: 'rgba(255,255,255,0.3)',
                  px: 1.25,
                  py: 0.25,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255,255,255,0.28)',
                    color: 'inherit',
                  },
                },
              }}
            >
              <ToggleButton value="B" aria-label={t('settings.dpmUnitB')}>
                B
              </ToggleButton>
              <ToggleButton value="T" aria-label={t('settings.dpmUnitT')}>
                T
              </ToggleButton>
            </ToggleButtonGroup>
          </Tooltip>
          <Tooltip title={t('settings.language')}>
            <IconButton color="inherit" onClick={toggleLang} aria-label="language">
              <TranslateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              mode === 'light' ? t('settings.dark') : t('settings.light')
            }
          >
            <IconButton
              color="inherit"
              onClick={onToggleMode}
              aria-label="theme"
            >
              {mode === 'light' ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
