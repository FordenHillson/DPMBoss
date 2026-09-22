# ADR 0001: Vite + React + MUI for MD3 calculator

## Status

Accepted

## Context

We need a static SPA for a boss DPM calculator, styled like Material Design 3, deployable to GitHub Pages.

## Decision

Use Vite + React + TypeScript with MUI (`@mui/material`) and Emotion, themed toward MD3 tokens via CssVarsProvider.

## Consequences

- Fast local DX and simple static build for Pages.
- MUI components (Slider, Select, TextField) map cleanly to the sketch.
- Bundle size is larger than raw Material Web, acceptable for this tool.
