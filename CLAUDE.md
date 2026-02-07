# CLAUDE.md

This file provides guidance for AI assistants working with the geas-web-vue codebase.

## Project Overview

**GEAS (Global Entry Appointment Search)** is a browser-only Vue 3 single-page application that helps users find available appointment slots for Global Entry, SENTRI, and FAST programs at U.S. CBP enrollment centers. It polls the CBP TTP Scheduler API and sends browser notifications when slots become available.

There is no backend server — the app runs entirely in the browser and calls the public CBP API directly.

## Tech Stack

- **Framework:** Vue 3.3 (Composition API with `<script setup>`)
- **Language:** TypeScript 5.6
- **Build Tool:** Vite 7.3
- **CSS:** Custom CSS (`src/assets/main.css`, no external CSS framework)
- **Icons:** Inline SVG paths (no icon library dependency)
- **Testing:** Vitest 4 + Vue Test Utils + jsdom
- **Node version:** 24

## Environment Setup

Before doing any work, always install dependencies first:

```bash
npm install
```

## Common Commands

```bash
npm run dev            # Start Vite dev server
npm run build          # Type-check and build for production (parallel)
npm run build-only     # Build without type-checking
npm run type-check     # Run vue-tsc type checking
npm run lint           # Run ESLint with --fix
npm run test           # Run Vitest once (CI-friendly)
npm run test:watch     # Run Vitest in watch mode
npm run format         # Run Prettier (write mode)
npm run format:check   # Run Prettier (check mode, used in CI)
```

## CI Pipeline

CI runs on every pull request and push to `main` (`.github/workflows/ci-on-pull-request.yaml`). It runs four parallel jobs on Ubuntu 22.04 with Node 24:

1. **eslint** — `npm run lint`
2. **type-check** — `npm run type-check`
3. **formatting** — `npm run format:check`
4. **test** — `npm run test`

Before submitting changes, verify all four pass locally:

```bash
npm run lint && npm run type-check && npm run format:check && npm run test
```

## Pre-commit Hooks

Husky runs `lint-staged` on pre-commit (`lint-staged.config.mjs`):

- `*.{js,ts,vue}` — eslint + format:check
- `*.ts?(x)` — type-check
- `*.{json,yaml,yml}` — format:check

## Testing

Unit tests use **Vitest** with **Vue Test Utils** and **jsdom** as the DOM environment. Configuration is in `vitest.config.ts`, which merges with `vite.config.ts` to share aliases and plugins.

- **Test location:** colocate tests in `src/**/__tests__/` directories (e.g., `src/components/__tests__/PageFooter.spec.ts`)
- **File naming:** `*.spec.ts` for test files
- **Imports:** use explicit imports from `vitest` (`import { describe, it, expect } from 'vitest'`)
- **Component mounting:** use `mount` or `shallowMount` from `@vue/test-utils`
- **Assertions must be deterministic:** never place `expect()` calls inside conditional blocks (`if`/`else`). Tests with conditional assertions can silently pass without checking anything. Restructure the test so every assertion always executes.
- **TypeScript config:** `tsconfig.vitest.json` extends `tsconfig.app.json` and includes test files (the app tsconfig excludes `__tests__`)

## Source Code Structure

```
src/
├── main.ts                    # App entry: Vue mount + CSS import
├── App.vue                    # Root component: template + composable wiring
├── apiTypes.ts                # TypeScript interfaces for CBP API responses
├── notificationsBuilder.ts    # Browser Notification API wrapper
├── assets/
│   ├── locations.json         # Static list of CBP enrollment centers (~208KB)
│   └── main.css               # Custom CSS (layout, forms, toggles, tooltips)
├── composables/
│   └── useAppointmentSearch.ts  # API polling, auto-retry, and search state
└── components/
    ├── AvailableAppointmentsList.vue   # Grouped list of available slots
    ├── AvailableAppointment.vue        # Single date group accordion
    ├── LocationsSelector.vue           # Enrollment center dropdown (v-model)
    ├── NotificationCheckbox.vue        # Browser notification toggle (v-model)
    ├── PageFooter.vue                  # Footer with GitHub link
    └── icons/
        └── IconHelpTooltip.vue         # Help icon with tooltip
```

## Architecture and Patterns

### State Management

No external state library (no Pinia/Vuex). All application state lives in the `useAppointmentSearch` composable (`src/composables/useAppointmentSearch.ts`), which `App.vue` consumes via Composition API.

### API Integration

The app calls a single endpoint:

```
https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&limit=1000&locationId={id}&minimum=1
```

Using the native `fetch` API with `AbortController` for cancellation. Auto-retry polls every 60 seconds via `setTimeout`. Errors are caught and surfaced in the UI via `fetchError` state. Timers and in-flight requests are cleaned up on component unmount via `onUnmounted`.

### Component Communication

- Props down (`:appointments` to list component)
- `v-model` for two-way binding (`LocationsSelector`, `NotificationCheckbox`)
- No `$refs` — all component communication uses props and events

### Notifications

`notificationsBuilder.ts` wraps the browser Notification API. Notifications use simple string interpolation and are tagged for deduplication.

## Code Conventions

### Formatting (Prettier)

- Semicolons: yes
- Tab width: 2 spaces
- Single quotes
- Print width: 100

### Naming

- Vue components: PascalCase filenames and component names
- TypeScript types: PascalCase prefixed with `Api` for API types (e.g., `ApiAvailableSlots`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_URL`, `DEFAULT_DELAY`)
- Utility files: camelCase (e.g., `notificationsBuilder.ts`)

### Vue Style

- Composition API with `<script setup lang="ts">`
- All styling in `src/assets/main.css` (components have no `<style>` blocks)
- `v-model` for parent-child two-way binding
- Composables (`src/composables/`) for reusable stateful logic

### Path Alias

`@` maps to `./src` (configured in both `vite.config.ts` and `tsconfig.app.json`).

## Key Files to Know

| File                                      | Purpose                                             |
| ----------------------------------------- | --------------------------------------------------- |
| `src/App.vue`                             | Root component: template + composable wiring        |
| `src/composables/useAppointmentSearch.ts` | API polling, auto-retry, search state, cleanup      |
| `src/apiTypes.ts`                         | TypeScript interfaces for CBP API responses         |
| `src/notificationsBuilder.ts`             | Browser notification creation                       |
| `src/main.ts`                             | Vue app bootstrap + CSS import                      |
| `src/assets/main.css`                     | All application styles                              |
| `src/assets/locations.json`               | Static CBP enrollment center data                   |
| `src/components/LocationsSelector.vue`    | Location dropdown (default: San Francisco, ID 5446) |

## Release Process

Releases are automated via `release-please` (`.github/workflows/release-please.yaml`). It creates release PRs and tags on pushes to `main`. Configuration is in `release-please-config.json` and `.release-please-manifest.json`.

## Things to Watch Out For

- **No routing** — this is a single-view app, no Vue Router
- **Tests use explicit imports** — import `describe`, `it`, `expect` from `vitest` (globals mode is not enabled)
- **Large static asset** — `locations.json` is ~208KB of embedded CBP location data
- **No external CSS framework** — all styles are custom in `src/assets/main.css`
- **Only dependency is `vue`** — no icon libraries, i18n, or CSS frameworks at runtime
