import type { Boss, PlayerCount } from './types'

function asPlayerCount(n: number): PlayerCount {
  const clamped = Math.min(6, Math.max(1, Math.floor(n))) as PlayerCount
  return clamped
}

/**
 * Resolve effective boss HP for the current party size.
 * Bosses with `hpByPlayers` scale; others use `totalHp`.
 */
export function resolveBossHp(boss: Boss, playerCount: number): number {
  const n = asPlayerCount(playerCount)
  const scaled = boss.hpByPlayers?.[`${n}`]
  if (scaled != null && Number.isFinite(scaled) && scaled > 0) {
    return scaled
  }
  return boss.totalHp > 0 ? boss.totalHp : 0
}

export function bossSupportsPlayerScaling(boss: Boss): boolean {
  return Boolean(boss.hpByPlayers && Object.keys(boss.hpByPlayers).length > 0)
}
