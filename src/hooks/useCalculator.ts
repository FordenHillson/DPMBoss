import { useCallback, useMemo, useState } from 'react'
import bossesData from '../data/bosses.json'
import type { Boss, Player } from '../domain/types'
import {
  equalSharePlayers,
  redistributeShare,
  toggleLock,
} from '../domain/shareRedistribute'

const bosses = bossesData as Boss[]

const DEFAULT_BOSS_ID = 'hard-will'
const DEFAULT_PLAYERS = 6
const DEFAULT_CLEAR_TIME = 15

export function useCalculator() {
  const [bossId, setBossId] = useState(DEFAULT_BOSS_ID)
  const [customHp, setCustomHp] = useState(16.32e12)
  const [customHpText, setCustomHpText] = useState('16.32T')
  const [clearTime, setClearTime] = useState(DEFAULT_CLEAR_TIME)
  const [players, setPlayers] = useState<Player[]>(() =>
    equalSharePlayers(DEFAULT_PLAYERS),
  )

  const selectedBoss = useMemo(
    () => bosses.find((b) => b.id === bossId) ?? bosses[0],
    [bossId],
  )

  const isCustom = selectedBoss.id === 'custom'

  const bossHp = isCustom ? customHp : selectedBoss.totalHp

  const setPlayerCount = useCallback((count: number) => {
    setPlayers(equalSharePlayers(count))
  }, [])

  const onShareChange = useCallback((playerId: number, share: number) => {
    setPlayers((prev) => redistributeShare(prev, playerId, share))
  }, [])

  const onToggleLock = useCallback((playerId: number) => {
    setPlayers((prev) => toggleLock(prev, playerId))
  }, [])

  const onTimeOverride = useCallback(
    (playerId: number, minutes: number | null) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId ? { ...p, timeOverride: minutes } : p,
        ),
      )
    },
    [],
  )

  return {
    bosses,
    bossId,
    setBossId,
    selectedBoss,
    isCustom,
    bossHp,
    customHp,
    setCustomHp,
    customHpText,
    setCustomHpText,
    clearTime,
    setClearTime,
    players,
    playerCount: players.length,
    setPlayerCount,
    onShareChange,
    onToggleLock,
    onTimeOverride,
  }
}
