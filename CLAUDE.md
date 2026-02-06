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
- **Testing:** Vitest + @vue/test-utils (jsdom environment)
- **Node version:** 24

## Common Commands

```bash
npm run dev            # Start Vite dev server
npm run build          # Type-check and build for production (parallel)
npm run build-only     # Build without type-checking
npm run type-check     # Run vue-tsc type checking
npm run lint           # Run ESLint with --fix
npm run test           # Run unit tests (vitest run)
npm run test:watch     # Run unit tests in watch mode (vitest)
npm run format         # Run Prettier (write mode)
npm run format:check   # Run Prettier (check mode, used in CI)
```

## CI Pipeline

CI runs on every pull request and push to `main` (`.github/workflows/ci-on-pull-request.yaml`). It runs three parallel jobs on Ubuntu 22.04 with Node 24:

1. **eslint** — `npm run lint`
2. **type-check** — `npm run type-check`
3. **formatting** — `npm run format:check`

Before submitting changes, verify all four pass locally:

```bash
npm run test && npm run lint && npm run type-check && npm run format:check
```

## Pre-commit Hooks

Husky runs `lint-staged` on pre-commit (`lint-staged.config.mjs`):

- `*.{js,ts,vue}` — eslint + format:check
- `*.ts?(x)` — type-check
- `*.{json,yaml,yml}` — format:check

## Source Code Structure

```
src/
├── main.ts                    # App entry: i18next init + Vue mount
├── App.vue                    # Root component: all app state and API logic
├── apiTypes.ts                # TypeScript types for CBP API responses
├── notificationsBuilder.ts    # Browser Notification API wrapper
├── vue-icon.d.ts              # Type declarations for @jamescoyle/vue-icon
├── __tests__/
│   └── notificationsBuilder.spec.ts   # Tests for notification builder
├── assets/
│   └── locations.json         # Static list of CBP enrollment centers (~208KB)
└── components/
    ├── AvailableAppointmentsList.vue   # Table of available slots
    ├── AvailableAppointment.vue        # Single appointment row
    ├── LocationsSelector.vue           # Enrollment center dropdown
    ├── NotificationCheckbox.vue        # Browser notification toggle
    ├── PageFooter.vue                  # Footer with GitHub link
    ├── __tests__/                      # Component unit tests
    │   ├── AvailableAppointment.spec.ts
    │   ├── AvailableAppointmentsList.spec.ts
    │   ├── IconHelpTooltip.spec.ts
    │   ├── LocationsSelector.spec.ts
    │   ├── NotificationCheckbox.spec.ts
    │   └── PageFooter.spec.ts
    └── icons/
        └── IconHelpTooltip.vue         # Help icon with tooltip
```

## Testing

Unit tests use **Vitest** with **@vue/test-utils** and a **jsdom** environment. Configuration is in `vitest.config.ts`.

- Test files live in `__tests__/` directories co-located with the source they test (e.g., `src/components/__tests__/`)
- Test files use the naming convention `*.spec.ts`
- The `@` path alias works in tests (resolves to `./src`)
- `tsconfig.vitest.json` extends `tsconfig.app.json` and adds `vitest/globals` types

```bash
npm run test           # Run all tests once
npm run test:watch     # Run tests in watch mode
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

### Commit Messages

This project uses **Conventional Commits** (<https://www.conventionalcommits.org/>). All commit messages must follow the format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`.

Examples:

- `feat: add appointment date filtering`
- `fix: correct notification permission check`
- `test: add unit tests for LocationsSelector`
- `docs: update CLAUDE.md with testing instructions`

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
- **Unit tests** — run `npm run test` before submitting; tests live in `__tests__/` directories adjacent to the source files
- **Large static asset** — `locations.json` is ~208KB of embedded CBP location data
- **CDN dependency** — Pico CSS is loaded from a CDN in `index.html`, not bundled
