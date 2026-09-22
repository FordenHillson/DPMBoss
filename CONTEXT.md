# Domain glossary

- **Boss** — A selectable boss encounter with a `totalHp` (full-party / 6p fallback) and optional `hpByPlayers` scaling.
- **Party** — A group of 1–6 players fighting one Boss.
- **Party-scaled HP** — For bosses that support it, effective HP depends on Party size (e.g. Hard Will: 1–2p = 6.85T, 6p = 16.32T). Resolved via `hpByPlayers`; otherwise `totalHp` is used.
- **Share** — A player's damage contribution percentage of the cake; all Shares in a Party sum to 100%.
- **Share Lock** — When locked, a player's Share is not changed by redistribute when another player moves their slider.
- **Clear Time** — Party-wide target clear duration in minutes.
- **Time Override** — Optional per-player minutes used instead of Clear Time when computing that player's Required DPM.
- **Required DPM** — `(effectiveBossHp × Share / 100) ÷ effectiveMinutes`, where `effectiveMinutes = Time Override ?? Clear Time`. Shown as an estimate band: **Avg** = exact required, **Min/Max** ≈ 0.5× / 1.75× of Avg for minute-to-minute variance.
- **Custom Boss** — A Boss entry whose HP is entered by the user rather than taken from the catalog.
