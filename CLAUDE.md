# CLAUDE.md

This file provides guidance for AI assistants working with the geas-web-vue codebase.

## Project Overview

**GEAS (Global Entry Appointment Search)** is a browser-only Vue 3 single-page application that helps users find available appointment slots for Global Entry, SENTRI, and FAST programs at U.S. CBP enrollment centers. It polls the CBP TTP Scheduler API and sends browser notifications when slots become available.

There is no backend server — the app runs entirely in the browser and calls the public CBP API directly.

## Tech Stack

- **Framework:** Vue 3.3 (Options API, not Composition API)
- **Language:** TypeScript 5.6
- **Build Tool:** Vite 7.3
- **CSS:** Pico CSS v1 (loaded from CDN in `index.html`, no custom CSS files)
- **Icons:** Material Design Icons via `@mdi/js` + `@jamescoyle/vue-icon`
- **i18n:** i18next (English only, configured inline in `src/main.ts`)
- **Testing:** Vitest 4 + Vue Test Utils + jsdom
- **Node version:** 24

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
- **TypeScript config:** `tsconfig.vitest.json` extends `tsconfig.app.json` and includes test files (the app tsconfig excludes `__tests__`)

## Source Code Structure

```
src/
├── main.ts                    # App entry: i18next init + Vue mount
├── App.vue                    # Root component: all app state and API logic
├── apiTypes.ts                # TypeScript types for CBP API responses
├── notificationsBuilder.ts    # Browser Notification API wrapper
├── vue-icon.d.ts              # Type declarations for @jamescoyle/vue-icon
├── assets/
│   └── locations.json         # Static list of CBP enrollment centers (~208KB)
└── components/
    ├── AvailableAppointmentsList.vue   # Table of available slots
    ├── AvailableAppointment.vue        # Single appointment row
    ├── LocationsSelector.vue           # Enrollment center dropdown
    ├── NotificationCheckbox.vue        # Browser notification toggle
    ├── PageFooter.vue                  # Footer with GitHub link
    └── icons/
        └── IconHelpTooltip.vue         # Help icon with tooltip
```

## Architecture and Patterns

### State Management

No external state library (no Pinia/Vuex). All application state lives in `App.vue` as an `AppData` interface using Vue's Options API `data()`. Child components are accessed via template refs (`this.$refs`).

### API Integration

The app calls a single endpoint:

```
https://ttp.cbp.dhs.gov/schedulerapi/slot-availability?locationId={id}
```

Using the native `fetch` API. Auto-retry polls every 60 seconds via `setTimeout`.

### Component Communication

- Props down (`:appointments` to list component)
- Refs up (`this.$refs.locationSelectorRef`, `this.$refs.notificationCheckboxRef`)
- No custom events emitted between components

### Notifications

`notificationsBuilder.ts` wraps the browser Notification API. Notifications use i18next for pluralized messages and are tagged for deduplication.

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

- Options API with TypeScript (`<script lang="ts">`)
- Components have `<style></style>` tags (currently empty — styling is from Pico CSS)
- Template refs for cross-component data access

### Path Alias

`@` maps to `./src` (configured in both `vite.config.ts` and `tsconfig.app.json`).

## Key Files to Know

| File                                   | Purpose                                              |
| -------------------------------------- | ---------------------------------------------------- |
| `src/App.vue`                          | All application state, API polling, auto-retry logic |
| `src/apiTypes.ts`                      | TypeScript definitions matching CBP API responses    |
| `src/notificationsBuilder.ts`          | Browser notification creation                        |
| `src/main.ts`                          | i18next configuration and Vue app bootstrap          |
| `src/assets/locations.json`            | Static CBP enrollment center data                    |
| `src/components/LocationsSelector.vue` | Location dropdown (default: San Francisco, ID 5446)  |

## Release Process

Releases are automated via `release-please` (`.github/workflows/release-please.yaml`). It creates release PRs and tags on pushes to `main`. Configuration is in `release-please-config.json` and `.release-please-manifest.json`.

## Things to Watch Out For

- **No error handling on fetch** — the API call in `App.vue` has no try-catch
- **No routing** — this is a single-view app, no Vue Router
- **Tests use explicit imports** — import `describe`, `it`, `expect` from `vitest` (globals mode is not enabled)
- **Large static asset** — `locations.json` is ~208KB of embedded CBP location data
- **CDN dependency** — Pico CSS is loaded from a CDN in `index.html`, not bundled
