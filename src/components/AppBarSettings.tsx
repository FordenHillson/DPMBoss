import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import TranslateIcon from '@mui/icons-material/Translate'
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

type Props = {
  mode: 'light' | 'dark'
  onToggleMode: () => void
}

export function AppBarSettings({ mode, onToggleMode }: Props) {
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
        <Stack direction="row" spacing={0.5}>
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
