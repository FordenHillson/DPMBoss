import { useCallback, useLayoutEffect, useState } from 'react'

const GAP = 20
/** Approximate unscaled PlayerRow card size (px). */
const BASE_CARD_W = 400
const BASE_CARD_H = 460
export const CARD_SCALE_MAX = 1.35

export function computeFitScale(
  count: number,
  containerW: number,
  containerH: number,
  cardW = BASE_CARD_W,
  cardH = BASE_CARD_H,
  gap = GAP,
): number {
  if (count < 1 || containerW <= 0 || containerH <= 0) return 1

  let best = 0.12
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols)
    const needW = cols * cardW + (cols - 1) * gap
    const needH = rows * cardH + (rows - 1) * gap
    if (needW <= 0 || needH <= 0) continue
    const s = Math.min(containerW / needW, containerH / needH)
    if (s > best) best = s
  }
  return Math.max(0.12, Math.min(best, CARD_SCALE_MAX))
}

/** Map slider 0–100 → scale between fitScale and max. */
export function scaleFromSlider(
  slider: number,
  fitScale: number,
  maxScale = CARD_SCALE_MAX,
): number {
  const t = Math.min(100, Math.max(0, slider)) / 100
  const lo = Math.min(fitScale, maxScale)
  const hi = Math.max(fitScale, maxScale)
  return lo + (hi - lo) * t
}

export function useCardFitScale(playerCount: number) {
  const [viewportEl, setViewportEl] = useState<HTMLElement | null>(null)
  const [fitScale, setFitScale] = useState(0.55)

  const viewportRef = useCallback((node: HTMLElement | null) => {
    setViewportEl(node)
  }, [])

  useLayoutEffect(() => {
    if (!viewportEl) return

    const measure = () => {
      const rect = viewportEl.getBoundingClientRect()
      // Leave a little breathing room for scrollbar / padding
      const w = Math.max(0, rect.width - 8)
      const h = Math.max(0, rect.height - 8)
      setFitScale(computeFitScale(playerCount, w, h))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(viewportEl)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [viewportEl, playerCount])

  return { viewportRef, fitScale }
}
