# Monorepo Overview

## Structure

- cms: Next.js (Admin / CMS)
- frontend: Astro (Public Website)

## Tech Stack

- pnpm workspace
- Next.js App Router
- Astro + React Islands
- GSAP / Three.js

## Development Policy

- cms と frontend は直接依存しない
- 共通型・API は将来 shared に集約
