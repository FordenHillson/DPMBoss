# Domain glossary

- **Boss** — A selectable boss encounter with a `totalHp` (raw units) and optional future `phases`.
- **Party** — A group of 1–6 players fighting one Boss.
- **Share** — A player's damage contribution percentage of the cake; all Shares in a Party sum to 100%.
- **Share Lock** — When locked, a player's Share is not changed by redistribute when another player moves their slider.
- **Clear Time** — Party-wide target clear duration in minutes.
- **Time Override** — Optional per-player minutes used instead of Clear Time when computing that player's Required DPM.
- **Required DPM** — `(Boss.totalHp × Share / 100) ÷ effectiveMinutes`, where `effectiveMinutes = Time Override ?? Clear Time`.
- **Custom Boss** — A Boss entry whose HP is entered by the user rather than taken from the catalog.
