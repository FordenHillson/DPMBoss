import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PartyControls } from './components/PartyControls'
import { PlayerRow } from './components/PlayerRow'
import { useCalculator } from './hooks/useCalculator'
import { AppBarSettings } from './components/AppBarSettings'
import type { DamageUnit } from './domain/formatHp'

type Props = {
  mode: 'light' | 'dark'
  onToggleMode: () => void
  dpmUnit: DamageUnit
  onDpmUnitChange: (unit: DamageUnit) => void
}

export default function App({
  mode,
  onToggleMode,
  dpmUnit,
  onDpmUnitChange,
}: Props) {
  const { t } = useTranslation()
  const calc = useCalculator()

  return (
    <>
      <AppBarSettings
        mode={mode}
        onToggleMode={onToggleMode}
        dpmUnit={dpmUnit}
        onDpmUnitChange={onDpmUnitChange}
      />
      <Container
        maxWidth={false}
        sx={{
          py: { xs: 2, md: 3 },
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: 1600,
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(320px, 400px) minmax(0, 1fr)',
            },
            alignItems: 'start',
          }}
        >
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              position: { md: 'sticky' },
              top: { md: 80 },
              alignSelf: 'start',
            }}
          >
            <Stack spacing={2.5}>
              <Typography variant="body2" color="text.secondary">
                {t('app.subtitle')}
              </Typography>
              <PartyControls
                bosses={calc.bosses}
                bossId={calc.bossId}
                onBossChange={calc.setBossId}
                bossHp={calc.bossHp}
                isCustom={calc.isCustom}
                customHpText={calc.customHpText}
                onCustomHpText={calc.setCustomHpText}
                onCustomHpParsed={calc.setCustomHp}
                playerCount={calc.playerCount}
                onPlayerCount={calc.setPlayerCount}
                clearTime={calc.clearTime}
                onClearTime={calc.setClearTime}
              />
            </Stack>
          </Paper>

          <Stack spacing={2}>
            <Box
              sx={{
                display: 'grid',
                gap: 2.5,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
                },
              }}
            >
              {calc.players.map((p) => (
                <PlayerRow
                  key={p.id}
                  player={p}
                  bossHp={calc.bossHp}
                  clearTime={calc.clearTime}
                  dpmUnit={dpmUnit}
                  onShareChange={(share) => calc.onShareChange(p.id, share)}
                  onToggleLock={() => calc.onToggleLock(p.id)}
                  onTimeOverride={(m) => calc.onTimeOverride(p.id, m)}
                />
              ))}
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: 'center' }}
            >
              v1.4.1 · DPM unit {dpmUnit}
            </Typography>
          </Stack>
        </Box>
      </Container>
    </>
  )
}
