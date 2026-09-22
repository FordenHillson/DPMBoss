import { Container, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PartyControls } from './components/PartyControls'
import { PlayerRow } from './components/PlayerRow'
import { useCalculator } from './hooks/useCalculator'
import { AppBarSettings } from './components/AppBarSettings'

type Props = {
  mode: 'light' | 'dark'
  onToggleMode: () => void
}

export default function App({ mode, onToggleMode }: Props) {
  const { t } = useTranslation()
  const calc = useCalculator()

  return (
    <>
      <AppBarSettings mode={mode} onToggleMode={onToggleMode} />
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Stack spacing={3}>
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

          <Stack spacing={2}>
            {calc.players.map((p) => (
              <PlayerRow
                key={p.id}
                player={p}
                bossHp={calc.bossHp}
                clearTime={calc.clearTime}
                onShareChange={(share) => calc.onShareChange(p.id, share)}
                onToggleLock={() => calc.onToggleLock(p.id)}
                onTimeOverride={(m) => calc.onTimeOverride(p.id, m)}
              />
            ))}
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            v1.1.0 · party HP scale
          </Typography>
        </Stack>
      </Container>
    </>
  )
}
