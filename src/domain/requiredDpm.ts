/** Required DPM = (bossHp × share%) / minutes */
export function requiredDpm(
  bossHp: number,
  sharePercent: number,
  minutes: number,
): number {
  if (minutes <= 0 || bossHp < 0 || sharePercent < 0) return 0
  return (bossHp * (sharePercent / 100)) / minutes
}

export function effectiveMinutes(
  clearTime: number,
  timeOverride: number | null | undefined,
): number {
  if (timeOverride != null && timeOverride > 0) return timeOverride
  return clearTime > 0 ? clearTime : 0
}
