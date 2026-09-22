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
      style={{ color, fontSize: size, flexShrink: 0 }}
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
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        minWidth: 0,
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: { xs: 2, sm: 2.5 },
          '&:last-child': { pb: { xs: 2, sm: 2.5 } },
        }}
      >
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

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Slider
            value={shareRounded}
            min={0}
            max={100}
            step={0.1}
            onChange={(_, v) => onShareChange(v as number)}
            disabled={player.locked}
            sx={{ flexGrow: 1, minWidth: 0 }}
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
            sx={{ width: 110, flexShrink: 0 }}
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
          fullWidth
        />

        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 2,
            px: { xs: 2, sm: 2.5 },
            py: 2,
            mt: 'auto',
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {t('player.requiredDpm')}
          </Typography>

          <Stack spacing={0.5} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <MaterialIcon name="speed" color={ICON_AVG} size={24} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t('player.dpmAvgLabel')}
              </Typography>
            </Stack>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, lineHeight: 1.2, wordBreak: 'break-all' }}
            >
              {formatDpm(estimate.avg, dpmUnit)}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1.5,
              mt: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.12)',
                borderRadius: 1.5,
                px: 1.5,
                py: 1.25,
                minWidth: 0,
              }}
            >
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                <MaterialIcon name="trending_down" color={ICON_MIN} size={18} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {t('player.dpmMinLabel')}
                </Typography>
              </Stack>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mt: 0.5, wordBreak: 'break-all' }}
              >
                {formatDpm(estimate.min, dpmUnit)}
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.12)',
                borderRadius: 1.5,
                px: 1.5,
                py: 1.25,
                minWidth: 0,
              }}
            >
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                <MaterialIcon name="trending_up" color={ICON_MAX} size={18} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {t('player.dpmMaxLabel')}
                </Typography>
              </Stack>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mt: 0.5, wordBreak: 'break-all' }}
              >
                {formatDpm(estimate.max, dpmUnit)}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            sx={{ opacity: 0.75, display: 'block', mt: 1.5, lineHeight: 1.4 }}
          >
            {t('player.dpmEstimateHint')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
