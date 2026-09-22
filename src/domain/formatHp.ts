const BILLION = 1e9
const TRILLION = 1e12

export type DamageUnit = 'B' | 'T'

/** Format raw HP into compact auto B/T display. */
export function formatDamage(value: number, fractionDigits = 4): string {
  if (!Number.isFinite(value) || value === 0) {
    return '0'
  }

  const abs = Math.abs(value)
  if (abs >= TRILLION) {
    return `${formatScaled(value / TRILLION, fractionDigits)}T`
  }
  if (abs >= BILLION) {
    return `${formatScaled(value / BILLION, fractionDigits)}B`
  }
  if (abs >= 1e6) {
    return `${formatScaled(value / 1e6, fractionDigits)}M`
  }
  return formatScaled(value, fractionDigits)
}

/**
 * Format Required DPM in a fixed unit.
 * Default unit is B (e.g. 1,264B); T shows the equivalent (e.g. 1.264T).
 */
export function formatDpm(
  value: number,
  unit: DamageUnit = 'B',
  fractionDigits = 4,
): string {
  if (!Number.isFinite(value) || value === 0) {
    return unit === 'T' ? '0T' : '0B'
  }

  if (unit === 'T') {
    return `${formatScaled(value / TRILLION, fractionDigits)}T`
  }

  // Prefer fewer decimals for large B values (e.g. 1264.0 → 1,264)
  const inB = value / BILLION
  const digits = Math.abs(inB) >= 100 ? 1 : fractionDigits
  return `${formatScaled(inB, digits)}B`
}

function formatScaled(n: number, fractionDigits: number): string {
  const trimmed = trimZeros(n.toFixed(fractionDigits))
  const negative = trimmed.startsWith('-')
  const body = negative ? trimmed.slice(1) : trimmed
  const [intPart, fracPart] = body.split('.')
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const assembled =
    fracPart != null ? `${withCommas}.${fracPart}` : withCommas
  return negative ? `-${assembled}` : assembled
}

function trimZeros(s: string): string {
  return s.replace(/\.?0+$/, '')
}

/** Parse user input like "16.32T" or "605.4B" into raw number. */
export function parseDamageInput(input: string): number | null {
  const trimmed = input.trim().replace(/,/g, '')
  if (!trimmed) return null

  const match = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*([TtBbMm])?$/)
  if (!match) {
    const asNumber = Number(trimmed)
    return Number.isFinite(asNumber) ? asNumber : null
  }

  const n = Number(match[1])
  const unit = (match[2] ?? '').toUpperCase()
  if (unit === 'T') return n * TRILLION
  if (unit === 'B') return n * BILLION
  if (unit === 'M') return n * 1e6
  return n
}
