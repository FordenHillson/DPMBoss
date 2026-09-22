# ADR 0003: GitHub Pages hosting

## Status

Accepted

## Context

The app is a static SPA and should be public under the FordenHillson GitHub account.

## Decision

Host on GitHub Pages at `/DPMBoss/` using Vite `base: '/DPMBoss/'` and a GitHub Actions workflow that builds and deploys on push to `main`.

## Consequences

- Asset paths must use the configured base.
- Free public hosting; no custom backend.
