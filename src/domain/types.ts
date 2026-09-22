export type LocalizedName = {
  th: string
  en: string
}

export type BossPhase = {
  hpPercent: number
  totalHp: number
}

export type Boss = {
  id: string
  name: LocalizedName
  totalHp: number
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
