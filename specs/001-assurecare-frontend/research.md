# Research: AssureCare Portal Frontend Stack

**Date**: 2026-02-25
**Feature**: 001-assurecare-frontend

---

## Decision 1: Build Tool

**Decision**: Vite 5 + React 18 + TypeScript 5

**Rationale**: Vite provides instant HMR, sub-second cold starts, and the industry-standard modern React SPA experience. Create React App is deprecated. Next.js adds unnecessary SSR complexity for a demo portal with no SEO requirements. Vite's output is a pure static bundle deployable anywhere.

**Alternatives considered**:
- Create React App — deprecated, slow builds, no longer recommended
- Next.js — over-engineered for a pure SPA with mocked data; adds file-system routing complexity

---

## Decision 2: Styling & Component Library

**Decision**: Tailwind CSS 3 + shadcn/ui (Radix UI primitives)

**Rationale**: shadcn/ui provides accessible, unstyled primitives (Dialog, Popover, Tooltip, Select, Tabs, Badge, Card, Table) that are copied into the project and fully customisable. Combined with Tailwind CSS this yields a clean, modern, healthcare-appropriate design without fighting against opinionated default styles. shadcn/ui uses Radix UI under the hood ensuring keyboard accessibility and ARIA compliance.

**Alternatives considered**:
- MUI (Material UI) — opinionated Material Design aesthetic, harder to get a clinical/neutral look without heavy overrides
- Ant Design — large bundle, enterprise-heavy aesthetic, less flexible for custom brand colours
- Mantine — excellent but requires mantine's own style system; shadcn/ui is simpler for a project starting fresh

---

## Decision 3: Charting

**Decision**: Recharts 2.x

**Rationale**: Recharts is the most widely adopted React-native SVG charting library. It supports composable line/area charts, reference lines and bands (for target ranges), custom dots (for missing data markers), tooltips, and responsive containers. API is declarative and integrates naturally with React state for time-range toggles.

**Alternatives considered**:
- Victory — more opinionated API, smaller community, less documentation
- Chart.js (react-chartjs-2) — Canvas-based, harder to customise markers and reference bands
- Tremor — opinionated dashboard component library that wraps Recharts; removed a layer of control

---

## Decision 4: Map

**Decision**: react-leaflet 4.x + Leaflet 1.9 with OpenStreetMap tiles

**Rationale**: Free, no API key required, excellent TypeScript support, well-maintained, and widely used in healthcare and logistics applications. OpenStreetMap tiles are free for demo use. Risk-coloured circle markers are trivial to implement with Leaflet's `CircleMarker`. Hover popups are built-in via `Popup` component.

**Alternatives considered**:
- MapboxGL / react-map-gl — requires a Mapbox API key (billing after free tier)
- Google Maps React — requires Google Cloud API key and billing setup
- Deck.gl — overkill for 10 patient pins

---

## Decision 5: State Management

**Decision**: Zustand 4.x

**Rationale**: Zustand is a minimal, boilerplate-free state management library ideal for a frontend-only app with mock data. Stores are plain TypeScript modules with hooks. Perfect for managing: active role, selected patient, filters, appointment mutations, action log, and escalation state — all in-session without persistence.

**Alternatives considered**:
- Redux Toolkit — excellent but significantly more boilerplate for a demo app with no async thunks
- React Context — suitable for simple cases but leads to prop drilling or performance issues with frequent updates (filters, selected patient)

---

## Decision 6: Routing

**Decision**: React Router v6 (declarative, nested routes)

**Rationale**: Standard for React SPAs. Role-based views implemented as top-level routes (`/caregiver`, `/doctor`) with a redirect from `/`. Nested routes handle drill-down panels within the Doctor view. React Router v6's `<Outlet>` pattern keeps layout components stable while swapping content.

**Alternatives considered**:
- TanStack Router — newer, excellent TypeScript support but adds complexity vs standard React Router for a small app

---

## Decision 7: Icons

**Decision**: Lucide React

**Rationale**: Clean, consistent, stroke-based icon set with excellent TypeScript support. 1500+ icons covering all needed symbols (heart, activity, bell, calendar, map-pin, user, alert-triangle, etc.). Lightweight tree-shakeable package.

**Alternatives considered**:
- Heroicons — fewer icons, Tailwind Labs project (good but smaller set)
- React Icons — huge bundle aggregator; no consistent style

---

## Decision 8: Date Utilities

**Decision**: date-fns 3.x

**Rationale**: Functional, tree-shakeable date library. Used for: formatting timestamps, computing "N days ago", generating date ranges for mock data seeding, and calculating 7/14/30 day windows for charts.

**Alternatives considered**:
- dayjs — similar size and API; date-fns has better TypeScript types and is more commonly used in the React ecosystem

---

## Decision 9: Mock Data Strategy

**Decision**: Static TypeScript modules in `src/data/mock/` initialised into Zustand stores on app mount

**Rationale**: All mock data is authored as typed TypeScript arrays/objects. The mock data covers 30 days of history for Ms. Tan (deteriorating trend) and 10 patients for the Doctor panel. Zustand stores hold the runtime state so mutations (create appointment, add note, escalate) update the UI reactively without a real API.

**Alternatives considered**:
- MSW (Mock Service Worker) — excellent for mocking REST APIs but unnecessary overhead when there is no API layer
- JSON files — less type-safe than TypeScript modules; can't embed helper functions

---

## Decision 10: TypeScript over plain JavaScript

**Decision**: TypeScript 5.x

**Rationale**: The user said "React JS" but also "use freely." TypeScript is the industry standard for React in 2025-2026, provides essential safety for the complex data model (vitals, alerts, appointments, audit logs), and produces cleaner, more maintainable code. All types are defined in `src/types/index.ts` and used throughout.
