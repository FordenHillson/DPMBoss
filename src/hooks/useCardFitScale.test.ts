import { describe, expect, it } from 'vitest'
import {
  CARD_SCALE_MAX,
  computeFitScale,
  scaleFromSlider,
} from './useCardFitScale'

describe('computeFitScale', () => {
  it('fits 6 cards into a medium panel', () => {
    const s = computeFitScale(6, 900, 700)
    expect(s).toBeGreaterThan(0.12)
    expect(s).toBeLessThanOrEqual(CARD_SCALE_MAX)
  })

  it('allows larger scale when only one card and lots of space', () => {
    const s = computeFitScale(1, 1200, 900)
    expect(s).toBeGreaterThan(1)
  })
})

describe('scaleFromSlider', () => {
  it('maps 0 to fit and 100 to max', () => {
    expect(scaleFromSlider(0, 0.4, 1.35)).toBeCloseTo(0.4)
    expect(scaleFromSlider(100, 0.4, 1.35)).toBeCloseTo(1.35)
    expect(scaleFromSlider(50, 0.4, 1.35)).toBeCloseTo(0.875)
  })

  it('still shrinks when fitScale is wrongly large', () => {
    expect(scaleFromSlider(0, 1.2, 1.35)).toBeLessThanOrEqual(1)
    expect(scaleFromSlider(100, 1.2, 1.35)).toBeCloseTo(1.35)
  })
})
