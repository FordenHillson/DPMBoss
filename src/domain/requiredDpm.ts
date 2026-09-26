/**
 * Heuristic minute-to-minute spread around average Required DPM
 * (quiet minutes ≈ 0.5×, burst minutes ≈ 1.75× — similar to in-game charts).
 */
export const DPM_ESTIMATE_MIN_FACTOR = 0.5
export const DPM_ESTIMATE_MAX_FACTOR = 1.75

/** Required DPM = (bossHp × share%) / minutes */
export function requiredDpm(
  bossHp: number,
  sharePercent: number,
  minutes: number,
): number {
  if (minutes <= 0 || bossHp < 0 || sharePercent < 0) return 0
  return (bossHp * (sharePercent / 100)) / minutes
}

export type RequiredDpmEstimate = {
  min: number
  avg: number
  max: number
}

/** Average required DPM plus estimated low/high band for fight variance. */
export function requiredDpmEstimate(
  bossHp: number,
  sharePercent: number,
  minutes: number,
): RequiredDpmEstimate {
  const avg = requiredDpm(bossHp, sharePercent, minutes)
  return {
    min: avg * DPM_ESTIMATE_MIN_FACTOR,
    avg,
    max: avg * DPM_ESTIMATE_MAX_FACTOR,
  }
}

/** Required damage (cake share) = bossHp × share% — no time. */
export function requiredDamage(
  bossHp: number,
  sharePercent: number,
): number {
  if (bossHp < 0 || sharePercent < 0) return 0
  return bossHp * (sharePercent / 100)
}

/** Average required damage plus the same 0.5×–1.75× estimate band. */
export function requiredDamageEstimate(
  bossHp: number,
  sharePercent: number,
): RequiredDpmEstimate {
  const avg = requiredDamage(bossHp, sharePercent)
  return {
    min: avg * DPM_ESTIMATE_MIN_FACTOR,
    avg,
    max: avg * DPM_ESTIMATE_MAX_FACTOR,
  }
}

export function effectiveMinutes(
  clearTime: number,
  timeOverride: number | null | undefined,
): number {
  if (timeOverride != null && timeOverride > 0) return timeOverride
  return clearTime > 0 ? clearTime : 0
}
