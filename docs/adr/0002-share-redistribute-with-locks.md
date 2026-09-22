# ADR 0002: Proportional share redistribute with locks

## Status

Accepted

## Context

Players split a 100% damage cake via sliders. Moving one slider must keep the total at 100%. Some shares should stay fixed while adjusting others.

## Decision

When player `i` is set to `newShare`:

1. Locked players (except the active one) keep their share.
2. Active share is clamped to `100 − sum(locked)`.
3. Remainder is distributed to unlocked non-active players proportional to their previous shares among themselves.
4. Changing party size resets to equal shares and clears locks.

## Consequences

- Predictable “cake” editing without manual rebalancing.
- Edge case: if all others are locked, active share is forced to the leftover only.
