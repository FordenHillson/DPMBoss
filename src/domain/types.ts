export type LocalizedName = {
  th: string
  en: string
}

/** Optional fight-phase rows (future). Not used for party-size HP. */
export type BossPhase = {
  hpPercent: number
  totalHp: number
}

export type PlayerCount = 1 | 2 | 3 | 4 | 5 | 6

/** HP totals keyed by party size for bosses that scale with players. */
export type HpByPlayers = Partial<Record<`${PlayerCount}`, number>>

export type Boss = {
  id: string
  name: LocalizedName
  /** Full-party (6p) HP fallback. */
  totalHp: number
  /** When present, HP changes with party size. */
  hpByPlayers?: HpByPlayers
  iconUrl?: string | null
  phases?: BossPhase[]
}

export type Player = {
  id: number
  share: number
  locked: boolean
  timeOverride: number | null
}

export type PartyState = {
  bossId: string
  customHp: number
  playerCount: number
  clearTime: number
  players: Player[]
}
