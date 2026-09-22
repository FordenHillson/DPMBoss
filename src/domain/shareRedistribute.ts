import type { Player } from './types'

const TOTAL = 100
const EPS = 1e-9

/** Create N players with equal shares; locks cleared. */
export function equalSharePlayers(count: number): Player[] {
  const n = Math.max(1, Math.min(6, Math.floor(count)))
  const base = TOTAL / n
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    share: base,
    locked: false,
    timeOverride: null,
  }))
}

/**
 * Drag player `activeId` to `newShare`.
 * Locked players keep share; remainder redistributed proportionally among unlocked others.
 */
export function redistributeShare(
  players: Player[],
  activeId: number,
  newShare: number,
): Player[] {
  const lockedSum = players
    .filter((p) => p.locked && p.id !== activeId)
    .reduce((s, p) => s + p.share, 0)

  const maxForActive = Math.max(0, TOTAL - lockedSum)
  const clampedActive = clamp(newShare, 0, maxForActive)

  const others = players.filter((p) => p.id !== activeId && !p.locked)
  const remainder = TOTAL - lockedSum - clampedActive

  if (others.length === 0) {
    return players.map((p) => {
      if (p.id === activeId) return { ...p, share: maxForActive }
      if (p.locked) return p
      return { ...p, share: 0 }
    })
  }

  const othersPrevSum = others.reduce((s, p) => s + p.share, 0)

  let next = players.map((p) => {
    if (p.id === activeId) return { ...p, share: clampedActive }
    if (p.locked) return p
    if (othersPrevSum <= EPS) {
      return { ...p, share: remainder / others.length }
    }
    const ratio = p.share / othersPrevSum
    return { ...p, share: remainder * ratio }
  })

  next = normalizeToHundred(next)
  return next
}

export function toggleLock(players: Player[], playerId: number): Player[] {
  return players.map((p) =>
    p.id === playerId ? { ...p, locked: !p.locked } : p,
  )
}

function normalizeToHundred(players: Player[]): Player[] {
  const sum = players.reduce((s, p) => s + p.share, 0)
  if (Math.abs(sum - TOTAL) < 0.01 || sum <= EPS) return players

  const unlocked = players.filter((p) => !p.locked)
  if (unlocked.length === 0) return players

  const diff = TOTAL - sum
  const lastUnlocked = unlocked[unlocked.length - 1]
  return players.map((p) =>
    p.id === lastUnlocked.id ? { ...p, share: p.share + diff } : p,
  )
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}
