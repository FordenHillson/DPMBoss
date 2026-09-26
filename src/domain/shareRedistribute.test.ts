import { describe, expect, it } from 'vitest'
import bossesData from '../data/bosses.json'
import { formatDamage, formatDpm, parseDamageInput } from './formatHp'
import { resolveBossHp } from './resolveBossHp'
import {
  effectiveMinutes,
  requiredDamage,
  requiredDamageEstimate,
  requiredDpm,
  requiredDpmEstimate,
} from './requiredDpm'
import {
  equalSharePlayers,
  redistributeShare,
  toggleLock,
} from './shareRedistribute'
import type { Boss } from './types'

const hardWill = (bossesData as Boss[]).find((b) => b.id === 'hard-will')!

describe('requiredDpm', () => {
  it('Hard Will 4% in 12 minutes => 51B DPM', () => {
    const bossHp = 15.3e12
    const dpm = requiredDpm(bossHp, 4, 12)
    expect(dpm).toBeCloseTo(0.051e12, -4)
    expect(formatDpm(dpm, 'B')).toBe('51B')
    expect(formatDpm(dpm, 'T')).toBe('0.051T')
  })

  it('uses time override via effectiveMinutes', () => {
    expect(effectiveMinutes(15, 12)).toBe(12)
    expect(effectiveMinutes(15, null)).toBe(15)
  })

  it('estimate band is 0.5×–1.75× of average', () => {
    const est = requiredDpmEstimate(6.85e12, 100, 12)
    expect(est.avg).toBeCloseTo(6.85e12 / 12)
    expect(est.min).toBeCloseTo(est.avg * 0.5)
    expect(est.max).toBeCloseTo(est.avg * 1.75)
  })
})

describe('requiredDamage', () => {
  it('HP 1000 at 10% => 100 avg, band 50–175', () => {
    expect(requiredDamage(1000, 10)).toBe(100)
    const est = requiredDamageEstimate(1000, 10)
    expect(est.avg).toBe(100)
    expect(est.min).toBe(50)
    expect(est.max).toBe(175)
  })

  it('does not depend on time (unlike requiredDpm)', () => {
    const dmg = requiredDamage(15.3e12, 4)
    const dpm12 = requiredDpm(15.3e12, 4, 12)
    expect(dmg).toBeCloseTo(dpm12 * 12)
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

  it('formatDpm forces B or T equivalently', () => {
    const value = 1.264e12
    expect(formatDpm(value, 'B')).toBe('1,264B')
    expect(formatDpm(value, 'T')).toBe('1.264T')
    expect(formatDamage(value)).toBe('1.264T')
  })
})

describe('resolveBossHp', () => {
  it('Hard Will scales with party size', () => {
    expect(resolveBossHp(hardWill, 1)).toBeCloseTo(6.43e12)
    expect(resolveBossHp(hardWill, 2)).toBeCloseTo(6.43e12)
    expect(resolveBossHp(hardWill, 3)).toBeCloseTo(9.03e12)
    expect(resolveBossHp(hardWill, 4)).toBeCloseTo(11.48e12)
    expect(resolveBossHp(hardWill, 5)).toBeCloseTo(14.08e12)
    expect(resolveBossHp(hardWill, 6)).toBeCloseTo(15.3e12)
  })

  it('falls back to totalHp when boss has no hpByPlayers', () => {
    const darknell = (bossesData as Boss[]).find((b) => b.id === 'darknell')!
    expect(resolveBossHp(darknell, 1)).toBe(darknell.totalHp)
    expect(resolveBossHp(darknell, 6)).toBe(darknell.totalHp)
  })

  it('1-player Hard Will full share uses scaled HP for DPM', () => {
    const hp = resolveBossHp(hardWill, 1)
    const dpm = requiredDpm(hp, 100, 15)
    expect(dpm).toBeCloseTo(6.43e12 / 15)
    expect(formatDpm(dpm, 'B')).toBe('428.7B')
    expect(formatDpm(dpm, 'T')).toBe('0.4287T')
  })
})
