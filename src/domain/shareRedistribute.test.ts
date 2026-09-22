import { describe, expect, it } from 'vitest'
import bossesData from '../data/bosses.json'
import { formatDamage, parseDamageInput } from './formatHp'
import { resolveBossHp } from './resolveBossHp'
import { effectiveMinutes, requiredDpm } from './requiredDpm'
import {
  equalSharePlayers,
  redistributeShare,
  toggleLock,
} from './shareRedistribute'
import type { Boss } from './types'

const hardWill = (bossesData as Boss[]).find((b) => b.id === 'hard-will')!

describe('requiredDpm', () => {
  it('Hard Will 4% in 12 minutes => 54.4B DPM', () => {
    const bossHp = 16.32e12
    const dpm = requiredDpm(bossHp, 4, 12)
    expect(dpm).toBeCloseTo(0.0544e12, -4)
    expect(formatDamage(dpm)).toBe('54.4B')
  })

  it('uses time override via effectiveMinutes', () => {
    expect(effectiveMinutes(15, 12)).toBe(12)
    expect(effectiveMinutes(15, null)).toBe(15)
  })
})

describe('redistributeShare', () => {
  it('keeps total at 100 and preserves ratios among others', () => {
    const players = equalSharePlayers(3) // ~33.333 each
    const next = redistributeShare(players, 1, 40)
    const sum = next.reduce((s, p) => s + p.share, 0)
    expect(sum).toBeCloseTo(100, 5)
    expect(next.find((p) => p.id === 1)!.share).toBeCloseTo(40, 5)
    const p2 = next.find((p) => p.id === 2)!.share
    const p3 = next.find((p) => p.id === 3)!.share
    expect(p2).toBeCloseTo(p3, 5)
  })

  it('does not change locked players', () => {
    let players = equalSharePlayers(3)
    players = toggleLock(players, 2)
    players = players.map((p) =>
      p.id === 2 ? { ...p, share: 20 } : p.id === 1 ? { ...p, share: 40 } : { ...p, share: 40 },
    )
    // normalize manually for start: p1=40 locked p2=20 p3=40 — wait lock only p2
    players = [
      { id: 1, share: 50, locked: false, timeOverride: null },
      { id: 2, share: 20, locked: true, timeOverride: null },
      { id: 3, share: 30, locked: false, timeOverride: null },
    ]
    const next = redistributeShare(players, 1, 60)
    expect(next.find((p) => p.id === 2)!.share).toBe(20)
    expect(next.find((p) => p.id === 1)!.share).toBeCloseTo(60, 5)
    expect(next.find((p) => p.id === 3)!.share).toBeCloseTo(20, 5)
  })
})

describe('formatHp', () => {
  it('parses T and B suffixes', () => {
    expect(parseDamageInput('16.32T')).toBeCloseTo(16.32e12)
    expect(parseDamageInput('605.4B')).toBeCloseTo(605.4e9)
  })
})

describe('resolveBossHp', () => {
  it('Hard Will scales with party size', () => {
    expect(resolveBossHp(hardWill, 1)).toBeCloseTo(6.85e12)
    expect(resolveBossHp(hardWill, 2)).toBeCloseTo(6.85e12)
    expect(resolveBossHp(hardWill, 3)).toBeCloseTo(9.63e12)
    expect(resolveBossHp(hardWill, 4)).toBeCloseTo(12.24e12)
    expect(resolveBossHp(hardWill, 5)).toBeCloseTo(15.01e12)
    expect(resolveBossHp(hardWill, 6)).toBeCloseTo(16.32e12)
  })

  it('falls back to totalHp when boss has no hpByPlayers', () => {
    const darknell = (bossesData as Boss[]).find((b) => b.id === 'darknell')!
    expect(resolveBossHp(darknell, 1)).toBe(darknell.totalHp)
    expect(resolveBossHp(darknell, 6)).toBe(darknell.totalHp)
  })

  it('1-player Hard Will full share uses scaled HP for DPM', () => {
    const hp = resolveBossHp(hardWill, 1)
    const dpm = requiredDpm(hp, 100, 15)
    expect(dpm).toBeCloseTo(6.85e12 / 15)
    expect(formatDamage(dpm)).toBe('456.6667B')
  })
})
