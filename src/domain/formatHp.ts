const BILLION = 1e9
const TRILLION = 1e12

/** Format raw HP / DPM into compact B/T display. */
export function formatDamage(value: number, fractionDigits = 4): string {
  if (!Number.isFinite(value) || value === 0) {
    return '0'
  }

  const abs = Math.abs(value)
  if (abs >= TRILLION) {
    return `${trimZeros((value / TRILLION).toFixed(fractionDigits))}T`
  }
  if (abs >= BILLION) {
    return `${trimZeros((value / BILLION).toFixed(fractionDigits))}B`
  }
  if (abs >= 1e6) {
    return `${trimZeros((value / 1e6).toFixed(fractionDigits))}M`
  }
  return `${trimZeros(value.toFixed(fractionDigits))}`
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
