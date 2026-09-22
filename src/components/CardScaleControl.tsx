import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import { Box, Slider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

type Props = {
  value: number
  onChange: (value: number) => void
  scale: number
}

export function CardScaleControl({ value, onChange, scale }: Props) {
  const { t } = useTranslation()

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{
        alignItems: { xs: 'stretch', sm: 'center' },
        px: 0.5,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ flexShrink: 0, minWidth: 88 }}
      >
        {t('settings.cardScale')}
      </Typography>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', flex: 1, minWidth: 0 }}
      >
        <ZoomOutIcon fontSize="small" color="action" />
        <Slider
          value={value}
          min={0}
          max={100}
          step={1}
          onChange={(_, v) => onChange(v as number)}
          valueLabelDisplay="auto"
          valueLabelFormat={() => `${Math.round(scale * 100)}%`}
          aria-label={t('settings.cardScale')}
          sx={{ flex: 1 }}
        />
        <ZoomInIcon fontSize="small" color="action" />
        <Box sx={{ minWidth: 52, textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            {Math.round(scale * 100)}%
          </Typography>
        </Box>
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {t('settings.cardScaleHint')}
      </Typography>
    </Stack>
  )
}
