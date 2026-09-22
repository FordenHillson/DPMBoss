import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PartyControls } from './components/PartyControls'
import { PlayerRow } from './components/PlayerRow'
import { CardScaleControl } from './components/CardScaleControl'
import { useCalculator } from './hooks/useCalculator'
import {
  CARD_SCALE_MAX,
  scaleFromSlider,
  useCardFitScale,
} from './hooks/useCardFitScale'
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
  const { viewportRef, fitScale } = useCardFitScale(calc.playerCount)

  const [slider, setSlider] = useState(() => {
    const saved = localStorage.getItem('dpmboss.cardScaleSlider')
    const n = saved != null ? Number(saved) : 70
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 70
  })

  useEffect(() => {
    localStorage.setItem('dpmboss.cardScaleSlider', String(slider))
  }, [slider])

  const scale = useMemo(
    () => scaleFromSlider(slider, fitScale, CARD_SCALE_MAX),
    [slider, fitScale],
  )

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
          minHeight: { md: 'calc(100dvh - 64px)' },
          boxSizing: 'border-box',
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
            alignItems: 'stretch',
            minHeight: { md: 'calc(100dvh - 64px - 48px)' },
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

          <Stack spacing={1.5} sx={{ minWidth: 0, minHeight: 0, height: '100%' }}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{ p: 1.5, borderRadius: 2, flexShrink: 0 }}
            >
              <CardScaleControl
                value={slider}
                onChange={setSlider}
                scale={scale}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: { xs: 'none', md: 'block' }, mt: 0.5, px: 0.5 }}
              >
                {t('settings.cardScaleHint')}
              </Typography>
            </Paper>

            <Box
              ref={viewportRef}
              sx={{
                flex: 1,
                minHeight: { xs: 420, md: 0 },
                overflow: 'auto',
                borderRadius: 2,
              }}
            >
              {/* zoom scales cards + text and shrinks layout box (Chromium/Safari/Firefox) */}
              <Box
                sx={{
                  zoom: scale,
                  display: 'grid',
                  gap: 2.5,
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
                  },
                  pb: 1,
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
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: 'center', flexShrink: 0 }}
            >
              v1.5.0 · DPM unit {dpmUnit}
            </Typography>
          </Stack>
        </Box>
      </Container>
    </>
  )
}
