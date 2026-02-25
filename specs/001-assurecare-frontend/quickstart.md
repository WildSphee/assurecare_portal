# Quickstart: AssureCare Portal Frontend

**Date**: 2026-02-25

---

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+ or pnpm 9+

---

## Setup

```bash
# From the repo root, initialise the React app
npm create vite@latest assurecare-portal -- --template react-ts
cd assurecare-portal

# Install core dependencies
npm install react-router-dom zustand recharts react-leaflet leaflet date-fns lucide-react clsx tailwind-merge

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui CLI and initialise
npx shadcn@latest init

# Add required shadcn/ui components
npx shadcn@latest add button card badge tabs tooltip dialog select sheet table checkbox popover

# Install Leaflet types
npm install -D @types/leaflet

# Install testing
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

## Development

```bash
# Start dev server (hot reload)
npm run dev
# → http://localhost:5173

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Configuration

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true
  }
})
```

### `tailwind.config.ts`
Extend with AssureCare brand tokens:
- `primary`: clinical blue (#1E40AF or similar)
- `danger`: alert red (#DC2626)
- `warning`: caution amber (#D97706)
- `safe`: healthy green (#16A34A)
- `surface`: light grey background (#F8FAFC)

---

## App Entry Points

| Route | View |
|-------|------|
| `/` | Redirects to `/caregiver` |
| `/caregiver` | Caregiver dashboard (Ana / Ms. Tan) |
| `/doctor` | Doctor panel (Dr. Chan) |
| `/doctor/patient/:id` | Patient drill-down (optional deep link) |

---

## Mock Data

All mock data lives in `src/data/mock/`. On app mount, `seedStores()` from `src/data/mock/index.ts` hydrates Zustand stores. No network calls are made.

To modify demo scenarios, edit the relevant file in `src/data/mock/` and the stores will reflect changes on next dev server reload.

---

## Key Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run test` | Run Vitest tests |
| `npm run test:ui` | Vitest UI mode |
| `npx shadcn@latest add [component]` | Add a new shadcn/ui component |
