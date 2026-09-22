import {
  Avatar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { formatDamage, parseDamageInput } from '../domain/formatHp'
import { resolveBossHp } from '../domain/resolveBossHp'
import type { Boss } from '../domain/types'

type Props = {
  bosses: Boss[]
  bossId: string
  onBossChange: (id: string) => void
  bossHp: number
  isCustom: boolean
  customHpText: string
  onCustomHpText: (text: string) => void
  onCustomHpParsed: (hp: number) => void
  playerCount: number
  onPlayerCount: (n: number) => void
  clearTime: number
  onClearTime: (n: number) => void
}

export function PartyControls({
  bosses,
  bossId,
  onBossChange,
  bossHp,
  isCustom,
  customHpText,
  onCustomHpText,
  onCustomHpParsed,
  playerCount,
  onPlayerCount,
  clearTime,
  onClearTime,
}: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('th') ? 'th' : 'en'

  return (
    <Stack spacing={2.5}>
      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="boss-label">{t('boss.label')}</InputLabel>
          <Select
            labelId="boss-label"
            label={t('boss.label')}
            value={bossId}
            onChange={(e) => onBossChange(e.target.value)}
            renderValue={(id) => {
              const b = bosses.find((x) => x.id === id)
              if (!b) return id
              return (
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <BossAvatar boss={b} />
                  <span>{b.name[lang]}</span>
                </Stack>
              )
            }}
          >
            {bosses.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <BossAvatar boss={b} />
                  <Box>
                    <Typography variant="body1">{b.name[lang]}</Typography>
                    {b.id !== 'custom' && (
                      <Typography variant="caption" color="text.secondary">
                        {formatDamage(resolveBossHp(b, playerCount))}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {!isCustom && (
          <TextField
            label={t('boss.hp')}
            value={formatDamage(bossHp)}
            slotProps={{ input: { readOnly: true } }}
            fullWidth
          />
        )}

        {isCustom && (
          <TextField
            label={t('boss.customHp')}
            helperText={t('boss.customHpHint')}
            value={customHpText}
            onChange={(e) => {
              const text = e.target.value
              onCustomHpText(text)
              const parsed = parseDamageInput(text)
              if (parsed != null && parsed >= 0) onCustomHpParsed(parsed)
            }}
            fullWidth
          />
        )}
      </Stack>

      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="players-label">{t('party.players')}</InputLabel>
          <Select
            labelId="players-label"
            label={t('party.players')}
            value={playerCount}
            onChange={(e) => onPlayerCount(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label={t('party.clearTime')}
          type="number"
          value={clearTime}
          onChange={(e) => {
            const n = Number(e.target.value)
            if (Number.isFinite(n) && n > 0) onClearTime(n)
          }}
          slotProps={{ htmlInput: { min: 0.1, step: 0.5 } }}
          fullWidth
        />
      </Stack>
    </Stack>
  )
}

function BossAvatar({ boss }: { boss: Boss }) {
  const letter = boss.name.en.charAt(0).toUpperCase()
  if (boss.iconUrl) {
    return <Avatar src={boss.iconUrl} alt={boss.name.en} sx={{ width: 32, height: 32 }} />
  }
  return (
    <Avatar
      sx={{
        width: 32,
        height: 32,
        bgcolor: 'primary.main',
        fontSize: 14,
      }}
    >
      {letter}
    </Avatar>
  )
}
