import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { formatDpm, type DamageUnit } from '../domain/formatHp'
import {
  effectiveMinutes,
  requiredDpmEstimate,
} from '../domain/requiredDpm'
import type { Player } from '../domain/types'

type Props = {
  player: Player
  bossHp: number
  clearTime: number
  dpmUnit: DamageUnit
  onShareChange: (share: number) => void
  onToggleLock: () => void
  onTimeOverride: (minutes: number | null) => void
}

const ICON_AVG = '#FFD54F'
const ICON_MIN = '#81C784'
const ICON_MAX = '#FF8A65'

function MaterialIcon({
  name,
  color,
  size = 20,
}: {
  name: string
  color: string
  size?: number
}) {
  return (
    <span
      className="material-symbols-outlined"
      aria-hidden
      style={{ color, fontSize: size, verticalAlign: 'middle' }}
    >
      {name}
    </span>
  )
}

export function PlayerRow({
  player,
  bossHp,
  clearTime,
  dpmUnit,
  onShareChange,
  onToggleLock,
  onTimeOverride,
}: Props) {
  const { t } = useTranslation()
  const minutes = effectiveMinutes(clearTime, player.timeOverride)
  const estimate = requiredDpmEstimate(bossHp, player.share, minutes)
  const shareRounded = Math.round(player.share * 10) / 10

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="h6" sx={{ minWidth: 28 }}>
              {player.id}
            </Typography>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {t('player.index', { n: player.id })}
            </Typography>
            <Tooltip title={player.locked ? t('player.unlock') : t('player.lock')}>
              <IconButton
                onClick={onToggleLock}
                color={player.locked ? 'primary' : 'default'}
                aria-label="lock"
              >
                {player.locked ? <LockIcon /> : <LockOpenIcon />}
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Slider
              value={shareRounded}
              min={0}
              max={100}
              step={0.1}
              onChange={(_, v) => onShareChange(v as number)}
              disabled={player.locked}
              sx={{ flexGrow: 1 }}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}%`}
            />
            <TextField
              label="%"
              type="number"
              value={shareRounded}
              onChange={(e) => {
                const n = Number(e.target.value)
                if (Number.isFinite(n)) onShareChange(n)
              }}
              disabled={player.locked}
              sx={{ width: 96 }}
              slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }}
            />
          </Stack>

          <TextField
            label={t('player.timeOverride')}
            helperText={t('player.timeOverrideHint')}
            type="number"
            value={player.timeOverride ?? ''}
            onChange={(e) => {
              const raw = e.target.value
              if (raw === '') {
                onTimeOverride(null)
                return
              }
              const n = Number(raw)
              if (Number.isFinite(n) && n > 0) onTimeOverride(n)
            }}
            slotProps={{ htmlInput: { min: 0.1, step: 0.5 } }}
            size="small"
          />

          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 2,
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {t('player.requiredDpm')}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', mt: 0.5 }}
            >
              <MaterialIcon name="speed" color={ICON_AVG} size={26} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t('player.dpmAvgLabel')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatDpm(estimate.avg, dpmUnit)}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center', flexWrap: 'wrap', mt: 0.75 }}
            >
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <MaterialIcon name="trending_down" color={ICON_MIN} />
                <Typography variant="body2">
                  {t('player.dpmMinLabel')}{' '}
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    {formatDpm(estimate.min, dpmUnit)}
                  </Box>
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                ·
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <MaterialIcon name="trending_up" color={ICON_MAX} />
                <Typography variant="body2">
                  {t('player.dpmMaxLabel')}{' '}
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    {formatDpm(estimate.max, dpmUnit)}
                  </Box>
                </Typography>
              </Stack>
            </Stack>

            <Typography
              variant="caption"
              sx={{ opacity: 0.75, display: 'block', mt: 0.75 }}
            >
              {t('player.dpmEstimateHint')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
