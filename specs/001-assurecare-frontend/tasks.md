---
description: "Task list for AssureCare Portal Frontend"
---

# Tasks: AssureCare Portal Frontend

**Input**: Design documents from `/specs/001-assurecare-frontend/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/mock-data.md ✅, quickstart.md ✅

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1–US8)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Bootstrap the Vite + React + TypeScript project with all dependencies, Tailwind, shadcn/ui, and routing configured. No user stories can begin until this is complete.

- [ ] T001 Initialize Vite React TypeScript project at `assurecare-portal/` using `npm create vite@latest assurecare-portal -- --template react-ts` and verify it runs with `npm run dev`
- [ ] T002 Install runtime dependencies: `react-router-dom zustand recharts react-leaflet leaflet date-fns lucide-react clsx tailwind-merge class-variance-authority` in `assurecare-portal/package.json`
- [ ] T003 Install dev dependencies: `tailwindcss postcss autoprefixer @types/leaflet vitest @testing-library/react @testing-library/jest-dom jsdom` in `assurecare-portal/package.json`
- [ ] T004 Configure Tailwind CSS — create `assurecare-portal/tailwind.config.ts` with content paths `['./index.html', './src/**/*.{ts,tsx}']` and extend theme with brand colours: `primary` (#1E40AF), `danger` (#DC2626), `warning` (#D97706), `safe` (#16A34A), `surface` (#F8FAFC)
- [ ] T005 Configure PostCSS — create `assurecare-portal/postcss.config.js` with tailwindcss and autoprefixer plugins
- [ ] T006 Add Tailwind directives to `assurecare-portal/src/index.css`: `@tailwind base; @tailwind components; @tailwind utilities;` and add CSS custom property for font family (Inter or system-ui)
- [ ] T007 Configure Vite — update `assurecare-portal/vite.config.ts` with path alias `@` → `./src` and Vitest config (jsdom environment, globals true, setupFiles `./src/test/setup.ts`)
- [ ] T008 Update `assurecare-portal/tsconfig.json` to include path alias `"@/*": ["./src/*"]` under compilerOptions.paths, and set `"baseUrl": "."`
- [ ] T009 Initialise shadcn/ui — run `npx shadcn@latest init` in `assurecare-portal/` choosing: TypeScript yes, style Default, base colour Slate, CSS variables yes, Tailwind config `tailwind.config.ts`, components path `@/components/ui`, utils path `@/lib/utils`
- [ ] T010 Add shadcn/ui components: run `npx shadcn@latest add button card badge tabs tooltip dialog select sheet table checkbox popover separator scroll-area avatar` in `assurecare-portal/`
- [ ] T011 [P] Create Vitest setup file at `assurecare-portal/src/test/setup.ts` importing `@testing-library/jest-dom`
- [ ] T012 Create directory structure: `assurecare-portal/src/{components/{ui,layout,shared,caregiver,doctor},pages,data/mock,store,hooks,lib,types}` — create `.gitkeep` in each empty folder
- [ ] T013 Clean up Vite boilerplate — remove default content from `assurecare-portal/src/App.tsx`, `assurecare-portal/src/App.css`, delete `assurecare-portal/src/assets/react.svg`

**Checkpoint**: `npm run dev` shows a blank page with no errors; Tailwind utilities work; shadcn/ui components importable.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: TypeScript types, all mock data modules, Zustand stores, risk engine, reason code mapping, and shared UI components that ALL user stories depend on. Must complete before any user story work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### 2A: TypeScript Types

- [ ] T014 Create `assurecare-portal/src/types/index.ts` with all TypeScript interfaces from data-model.md: `RiskLevel`, `ReasonCode`, `EvidencePointer`, `Patient`, `User`, `CheckinSession`, `VitalsRecord`, `AdherenceRecord`, `SymptomSignal`, `Alert`, `AISummary`, `Appointment`, `AppointmentReason`, `ActionLogEntry`, `ActionType`, `DoctorNote`, `CaregiverNote`, `ChatbotMessage`, `EscalationRecord`, `CarePlanItem`, `TrendDataPoint`, `TimelineEvent` — export all

### 2B: Mock Data Modules

- [ ] T015 Create `assurecare-portal/src/data/mock/patients.ts` — export `MOCK_PATIENTS: Patient[]` with exactly 10 patients: Ms. Tan (patient-001, yellow, hypertension + MI), Mr. Lim (patient-002, red), Mrs. Wong (patient-003, red), Mr. Kumar (patient-004, yellow), Ms. Lee (patient-005, yellow), Mr. Ang (patient-006, yellow), Mrs. Chong (patient-007, green, no data >48h), Mr. Raj (patient-008, green), Ms. Siti (patient-009, green), Mr. Chen (patient-010, green); include mock Singapore lat/lng coordinates for all
- [ ] T016 Create `assurecare-portal/src/data/mock/vitals.ts` — export `MOCK_VITALS: VitalsRecord[]` with 30 days of records for all 10 patients; Ms. Tan's systolic must increase from ~130 to ~148 over Feb 15–24; include 3 missing days for Ms. Tan and 1 outlier record (`qualityFlag: "outlier"`); other patients have stable or slightly elevated readings consistent with their risk level
- [ ] T017 Create `assurecare-portal/src/data/mock/adherence.ts` — export `MOCK_ADHERENCE: AdherenceRecord[]` with 30 days per patient; Ms. Tan must have `medsEveningTaken: false` on 2026-02-23 and 2026-02-24; Mr. Lim must have 2 consecutive missed morning meds; other patients mostly compliant
- [ ] T018 Create `assurecare-portal/src/data/mock/symptoms.ts` — export `MOCK_SYMPTOMS: SymptomSignal[]`; Ms. Tan: dizziness moderate on 2026-02-24; Mr. Lim: chest tightness severe on 2026-02-23 and 2026-02-24; Mrs. Wong: shortness of breath moderate; Mr. Kumar: dizziness mild; others symptom-free
- [ ] T019 Create `assurecare-portal/src/data/mock/alerts.ts` — export `MOCK_ALERTS: Alert[]`; Ms. Tan: open yellow alert with `reasonCodes: ["BP_UPTREND_5D", "MISSED_MEDS_STREAK_2"]` and 2 evidencePointers ("BP increased from 130 to 148 mmHg over last 10 days", "Evening medication missed on Feb 23 and Feb 24"); Mr. Lim: open red alert with `reasonCodes: ["SYMPTOM_CHEST_TIGHTNESS_SEVERE", "NO_RESPONSE_STREAK_2"]`; Mrs. Wong: open red alert; other yellow patients: open yellow alerts with appropriate reason codes
- [ ] T020 Create `assurecare-portal/src/data/mock/aiSummaries.ts` — export `MOCK_AI_SUMMARIES: AISummary[]`; Ms. Tan daily summary highlights: ["BP has increased from 130 to 148 mmHg over the past 10 days", "Evening medication missed on Feb 23 and Feb 24", "Dizziness (moderate) reported on Feb 24", "Morning medication taken consistently for 14 days", "Check-in completed at 09:05 today"]; suggestedActions: ["Consider calling Ms. Tan to check how she is feeling", "Remind Ms. Tan to take her evening medication", "Consider booking a clinic visit if symptoms continue"]; also create a clinical summary for each patient
- [ ] T021 Create `assurecare-portal/src/data/mock/appointments.ts` — export `MOCK_APPOINTMENTS: Appointment[]`; Ms. Tan: one scheduled appointment on 2026-03-03 (routine follow-up, status: "scheduled"); Mr. Kumar: appointment on 2026-03-05 (medication review, status: "scheduled"); Mrs. Wong: appointment requested but not yet scheduled (status: "requested"); at least 5 total appointments for KPI counter
- [ ] T022 Create `assurecare-portal/src/data/mock/actionLog.ts` — export `MOCK_ACTION_LOG: ActionLogEntry[]` with 5–8 pre-seeded entries: Ana called Ms. Tan (2026-02-23), Dr. Chan sent message to Ms. Tan's device (2026-02-22), Ana requested appointment (2026-02-20), Dr. Chan marked Mr. Lim reviewed (2026-02-24), Ana sent escalation to Dr. Chan (2026-02-23)
- [ ] T023 Create `assurecare-portal/src/data/mock/messages.ts` — export `MOCK_MESSAGES: ChatbotMessage[]` with 2–3 messages per patient; include templates: "Please remember to take your evening medication", "Your doctor has sent a message: please check in tomorrow morning"
- [ ] T024 Create `assurecare-portal/src/data/mock/escalations.ts` — export `MOCK_ESCALATIONS: EscalationRecord[]` with 1 resolved and 1 pending escalation for Ms. Tan and Mr. Lim respectively
- [ ] T025 Create `assurecare-portal/src/data/mock/carePlan.ts` — export `MOCK_CARE_PLAN: CarePlanItem[]` for Ms. Tan with 4 items: "Take blood pressure medication twice daily (morning and evening)", "Monitor and record blood pressure daily", "30-minute light walk 5 days a week", "Contact clinic if BP exceeds 150/90 or symptoms worsen"
- [ ] T026 Create `assurecare-portal/src/data/mock/users.ts` — export `MOCK_USERS: User[]` with Ana (user-ana, caregiver, phone: +65-9111-2222) and Dr. Chan (user-dr-chan, doctor, phone: +65-6333-4444, email: dr.chan@clinic.sg)
- [ ] T027 Create `assurecare-portal/src/data/mock/index.ts` — re-export all MOCK_* arrays; export `seedStores(patientStore, appointmentStore, actionLogStore)` function that hydrates stores from mock data on app mount

### 2C: Zustand Stores

- [ ] T028 Create `assurecare-portal/src/store/usePatientStore.ts` — Zustand store with state: `patients: Patient[]`, `alerts: Alert[]`, `symptoms: SymptomSignal[]`, `vitals: VitalsRecord[]`, `adherence: AdherenceRecord[]`, `aiSummaries: AISummary[]`, `notes: { doctor: DoctorNote[], caregiver: CaregiverNote[] }`, `escalations: EscalationRecord[]`, `messages: ChatbotMessage[]`; actions: `seed(data)`, `addDoctorNote(note)`, `addCaregiverNote(note)`, `updateAlertStatus(alertId, status)`, `addEscalation(escalation)`, `addMessage(message)`
- [ ] T029 Create `assurecare-portal/src/store/useAppointmentStore.ts` — Zustand store with state: `appointments: Appointment[]`; actions: `seed(appointments)`, `requestAppointment(appt)`, `scheduleAppointment(id, scheduledAt)`, `cancelAppointment(id)`
- [ ] T030 Create `assurecare-portal/src/store/useActionLogStore.ts` — Zustand store with state: `entries: ActionLogEntry[]`; actions: `seed(entries)`, `addEntry(entry)`; helper `logAction(actorUserId, actorRole, patientId, actionType, payload)`
- [ ] T031 Create `assurecare-portal/src/store/useUIStore.ts` — Zustand store with state: `activeRole: "caregiver" | "doctor"`, `selectedPatientId: string | null`, `doctorViewMode: "cards" | "table" | "map"`, `activeFilters: string[]`, `searchQuery: string`, `showDetailedScoring: boolean`; actions: `setRole`, `setSelectedPatient`, `setViewMode`, `setFilter`, `clearFilters`, `setSearch`, `toggleDetailedScoring`

### 2D: Risk Engine & Utilities

- [ ] T032 Create `assurecare-portal/src/lib/riskEngine.ts` — export `computeRiskStatus(patientId, vitals, adherence, symptoms, checkins): { level: RiskLevel, reasonCodes: ReasonCode[], score: number, scoreBreakdown: Record<string, number> }` implementing rules from data-model.md: BP uptrend 5d (+3), missed meds streak ≥2 (+3), missed meds yesterday (+2), severe symptom (+3), no response streak ≥2 (+2), engagement drop 30% (+1); level: 0–2=green, 3–5=yellow, 6+=red
- [ ] T033 Create `assurecare-portal/src/lib/reasonCodes.ts` — export `REASON_CODE_LABELS: Record<ReasonCode, string>` mapping each code to human-readable label (e.g., `BP_UPTREND_5D` → "Blood pressure trending upward over 5 days") and `REASON_CODE_DESCRIPTIONS: Record<ReasonCode, string>` with longer explanations for tooltips
- [ ] T034 Create `assurecare-portal/src/lib/dateUtils.ts` — export helpers using date-fns: `formatDate(iso)`, `formatDateTime(iso)`, `formatRelative(iso)` (e.g., "3 hours ago"), `getLast7Days()`, `getLast14Days()`, `getLast30Days()`, `getDateRange(days)`, `isToday(iso)`, `daysBetween(a, b)`
- [ ] T035 Create `assurecare-portal/src/lib/utils.ts` — export `cn(...classes)` helper using `clsx` + `tailwind-merge` for className merging (standard shadcn/ui pattern); export `getRiskColor(level: RiskLevel): string` returning Tailwind colour class, `getRiskBgColor(level)`, `getRiskBorderColor(level)`, `getRiskLabel(level)` ("All clear" / "Needs attention" / "Urgent attention")

### 2E: Shared Custom Hooks

- [ ] T036 Create `assurecare-portal/src/hooks/usePatient.ts` — export `usePatient(patientId: string)` returning patient, latest vitals, today's adherence, active symptoms, latest alert, latest AI summary, upcoming appointments, caregiver notes, doctor notes; derived from Zustand stores
- [ ] T037 Create `assurecare-portal/src/hooks/useVitalsHistory.ts` — export `useVitalsHistory(patientId, days: 7|14|30)` returning filtered vitals as `TrendDataPoint[]` for BP systolic, BP diastolic, HR; handles missing days (returns null), marks outliers
- [ ] T038 Create `assurecare-portal/src/hooks/useAdherenceHistory.ts` — export `useAdherenceHistory(patientId, days)` returning adherence data as daily objects with `medsMorning`, `medsEvening`, `exercise`, `adherencePercent` for the day
- [ ] T039 Create `assurecare-portal/src/hooks/useTimeline.ts` — export `useTimeline(patientId, daysBack: 7|14)` returning merged `TimelineEvent[]` sorted by timestamp desc — combining: alerts, vitals records, adherence events (missed = flagged), symptoms, checkin sessions, messages, escalations, appointments, doctor/caregiver notes

**Checkpoint**: All types, mock data, stores, engine, and hooks are in place. Running `npm run dev` still shows blank page — no visual output yet, but console should be error-free.

---

## Phase 3: User Story 8 — Mock Login & Role-Based Navigation (Priority: P1)

**Goal**: App shell with Caregiver/Doctor role switcher renders correctly, routing works, role-based view separation enforced.

**Independent Test**: Navigate to `/caregiver` → see "Caregiver" heading with Ms. Tan context. Navigate to `/doctor` → see "Doctor Panel" heading with multi-patient context. No cross-role UI elements visible.

- [ ] T040 [US8] Create `assurecare-portal/src/App.tsx` — set up React Router v6 with routes: `/` (redirect to `/caregiver`), `/caregiver` (renders CaregiverPage), `/doctor` (renders DoctorPage); wrap with `<BrowserRouter>`; call `seedStores()` from mock/index.ts on mount using `useEffect`
- [ ] T041 [US8] Create `assurecare-portal/src/components/layout/AppShell.tsx` — outer layout with a top navigation bar (AssureCare logo/name on left, role tab switcher in centre, "Logged in as: Ana / Dr. Chan" badge on right based on active role); renders `<Outlet />` for page content; sticky top navbar; uses `useUIStore` for active role; height 64px, bg white, border-bottom
- [ ] T042 [US8] Create `assurecare-portal/src/components/layout/RoleNav.tsx` — two pill-style tabs: "Caregiver (Ana)" and "Doctor (Dr. Chan)"; clicking switches `activeRole` in useUIStore and navigates to `/caregiver` or `/doctor`; active tab has primary colour background; uses shadcn/ui Tabs or custom styled divs
- [ ] T043 [US8] Create `assurecare-portal/src/pages/CaregiverPage.tsx` — page component rendering placeholder `<div>Caregiver Dashboard — Ms. Tan</div>` inside AppShell; imports and uses useUIStore to confirm role is "caregiver"; will be filled in Phase 4
- [ ] T044 [US8] Create `assurecare-portal/src/pages/DoctorPage.tsx` — page component rendering placeholder `<div>Doctor Panel — Dr. Chan</div>` inside AppShell; will be filled in Phase 5
- [ ] T045 [US8] Update `assurecare-portal/src/main.tsx` — wrap app with StrictMode, render `<App />`, import `index.css`

**Checkpoint**: `npm run dev` → clicking Caregiver tab shows caregiver placeholder; clicking Doctor tab shows doctor placeholder. Navigation URL changes. Role badge in header updates.

---

## Phase 4: User Story 1 — Caregiver Daily Dashboard (Priority: P1) 🎯 MVP

**Goal**: Ana can see Ms. Tan's complete daily dashboard: sticky header with quick actions, risk banner with explainability, 4–6 metric tiles with tooltips, and AI summary section.

**Independent Test**: Load `/caregiver` → verify sticky header (patient name, conditions, 4 action buttons), yellow risk banner with 2 reason drivers and evidence, 6 metric tiles all populated, AI summary with 5 bullets and action prompts, confidence/freshness stamp.

### 4A: Caregiver Header

- [ ] T046 [US1] Create `assurecare-portal/src/components/caregiver/CaregiverHeader.tsx` — sticky header (below AppShell) showing: patient photo placeholder + "Ms. Tan, 68" + condition pills ("Hypertension", "Mild Heart Attack — 1 week ago") on left; "Primary Caregiver: Ana | Doctor: Dr. Chan (+65-6333-4444)" in centre; four action buttons on right using shadcn/ui Button; styles: bg-white, shadow-sm, px-6 py-4, z-10 sticky top-[64px]
- [ ] T047 [P] [US1] Create `assurecare-portal/src/components/caregiver/QuickActions.tsx` — four buttons: "Call Ms. Tan" (phone icon, tel: link, logs call_initiated action), "Message" (message icon, opens MessagingModal), "Escalate / Book" (opens EscalationPanel drawer), "Emergency" (red outline button, opens EmergencyGuidanceDialog); each click logs to actionLogStore

### 4B: Emergency Guidance Dialog

- [ ] T048 [P] [US1] Create `assurecare-portal/src/components/shared/EmergencyGuidanceDialog.tsx` — shadcn/ui Dialog showing static content: "If Ms. Tan is unresponsive or in acute distress:" → list: "Call 995 (Singapore Emergency Services)", "Contact Dr. Chan: +65-6333-4444", "Contact Ana (backup): +65-9111-2222"; red header; close button; no auto-dial functionality

### 4C: Risk Banner

- [ ] T049 [US1] Create `assurecare-portal/src/components/shared/RiskBanner.tsx` — full-width banner component accepting props from contracts/mock-data.md `RiskBannerProps`; layout: coloured left border (4px) + bg-opacity-10 bg matching risk colour; left section: large risk level badge + label ("Needs attention today"); centre: top 1–3 reason code chips in human-readable form; right: "Last updated: [time]" + "Latest check-in: today 09:05"; bottom: collapsible "Why this status?" panel showing evidencePointers as bullet list; uses `REASON_CODE_LABELS` from reasonCodes.ts; `showDetailedScoring` prop shows score breakdown (doctor-only); animate chevron on expand/collapse
- [ ] T050 [US1] Wire RiskBanner in CaregiverPage — use `usePatient("patient-001")` to get latest alert; derive `dataFreshnessLabel` from last checkin session timestamp; render RiskBanner at top of page content (below sticky header)

### 4D: Today at a Glance Tiles

- [ ] T051 [US1] Create `assurecare-portal/src/components/shared/MetricTile.tsx` — card component accepting `MetricTileProps` from contracts/mock-data.md; layout: icon top-left, title, large value, unit, trend arrow (↑↓→) coloured by trendColor, streak badge bottom-left, "Updated [time]" bottom-right; shadcn/ui Tooltip on "?" icon showing tooltipText; border-left 3px coloured by status (green/amber/red); hover: subtle shadow increase
- [ ] T052 [US1] Create `assurecare-portal/src/components/caregiver/TodayGlance.tsx` — renders 6 MetricTiles in a responsive grid (3 cols desktop, 2 cols tablet); derives data from `usePatient("patient-001")` and today's adherence/vitals; tiles: (1) Medication adherence: "Morning ✓ / Evening ✗" + "5-day streak" + tooltip "Tracks if Ms. Tan took her prescribed medications"; (2) Blood Pressure: "148/92 mmHg" + trend arrow up (red) + tooltip; (3) Heart Rate: "82 bpm" + stable arrow + tooltip; (4) Symptoms: "Dizziness (moderate)" or "None reported" + tooltip; (5) Exercise: "Not recorded today" + tooltip; (6) Engagement: "Check-in completed 09:05" + tooltip

### 4E: AI Summary

- [ ] T053 [US1] Create `assurecare-portal/src/components/shared/AISummary.tsx` — card section with header "Key Things to Note"; top: confidence badge (Medium) + freshness ("Based on data: Feb 18 – Feb 25, 2026, generated today 09:10"); body: 5 highlight bullets with icons (⚠️ for warnings, ✓ for positives); "Why the banner is yellow" explanation paragraph in a rounded bg-yellow-50 box; "Suggested Actions" section with 3 action prompts styled as gentle nudges (non-medical language, using data from `suggestedActions`); bottom-right: small disclaimer "This summary is for informational purposes only. Consult Dr. Chan for medical decisions."
- [ ] T054 [US1] Wire AISummary in CaregiverPage — use latest daily AI summary from `usePatient("patient-001")`; render below TodayGlance; section heading "Key Things to Note"

### 4F: CaregiverPage Layout Assembly

- [ ] T055 [US1] Update `assurecare-portal/src/pages/CaregiverPage.tsx` — assemble full page layout: CaregiverHeader (sticky), page content (max-w-7xl mx-auto px-6 py-8): RiskBanner, section gap, TodayGlance, section gap, AISummary; remaining sections (charts, timeline, escalation, notes) are placeholders that will be filled in later phases; smooth scroll between sections

**Checkpoint**: `/caregiver` shows complete Phase 4 dashboard: sticky header with 4 action buttons, yellow risk banner with "Why?" panel, 6 populated tiles, AI summary with bullets and action prompts. Emergency dialog opens on click.

---

## Phase 5: User Story 5 — Doctor Panel Triage Dashboard (Priority: P1)

**Goal**: Dr. Chan can see 10 patient cards in a grid with KPI counters, risk badges, filter chips, sort controls, and search — all driven by mock data.

**Independent Test**: Load `/doctor` → KPI counters show 2 red, 3 yellow, 1 no-data, 5 upcoming appointments; filter chip "Red" shows only 2 cards; search "Tan" shows Ms. Tan's card; each card shows name, risk badge, AI label, BP/HR, 7-day adherence dots, next appt.

### 5A: KPI Counters

- [ ] T056 [US5] Create `assurecare-portal/src/components/doctor/KPICounters.tsx` — row of 4 stat cards using shadcn/ui Card; each card: large number, label, icon; Red Alerts Today (count of open red alerts, danger colour, alert-triangle icon), Yellow Watchlist (open yellow alerts, warning colour, eye icon), No Data >48h (patients with noResponseStreak≥2, grey, wifi-off icon), Appointments Next 7 Days (count, primary colour, calendar icon); each card clickable — clicking applies the corresponding filter via useUIStore.setFilter; active filter state highlighted with coloured border
- [ ] T057 [US5] Create `assurecare-portal/src/components/doctor/DoctorHeader.tsx` — header bar with: search input (magnifying glass icon, placeholder "Search patient name…", updates useUIStore.searchQuery on change), filter chips row (Red, Yellow, No data >48h, Post-discharge, Hypertension — toggle-style badges, active=coloured bg), sort dropdown (Risk: High→Low, Newest Alerts, Upcoming Appointments) using shadcn/ui Select, view toggle buttons (grid icon for Cards, list icon for Table, map icon for Map) updating useUIStore.doctorViewMode

### 5B: Patient Card

- [ ] T058 [US5] Create `assurecare-portal/src/components/doctor/PatientCard.tsx` — shadcn/ui Card component accepting `PatientCardProps` from contracts/mock-data.md; layout: top-left: name + age (bold), risk badge (coloured), AI label (italic small text e.g. "BP rising + missed meds"); middle-left: "Last updated: 6h ago" (grey); middle-right: vitals chip "BP 148/92 · HR 82"; bottom-left: 7-day adherence dots (7 small circles, green=taken, red=missed, grey=no data); bottom-right: symptom icon(s) (pill, heart, activity) if applicable + "Appt: Mar 3" if exists; card actions row (below fold on hover or always visible on desktop): "Open", "Follow-up", "Schedule", "Add Note", "Reviewed" — small ghost buttons with icons; card border-left 4px coloured by risk level; hover: shadow-md cursor-pointer
- [ ] T059 [US5] Create `assurecare-portal/src/components/doctor/PatientCardGrid.tsx` — responsive grid of PatientCards (3 cols desktop, 2 cols tablet); reads patients from usePatientStore; applies search filter (name match), active filters (risk level, no-data, condition), and sort order from useUIStore; renders "No patients match filters" empty state if none; clicking "Open" on card sets useUIStore.selectedPatientId and opens DrillDownPanel (placeholder for now)

### 5C: Doctor Page Assembly

- [ ] T060 [US5] Update `assurecare-portal/src/pages/DoctorPage.tsx` — full layout: DoctorHeader (sticky below AppShell), KPICounters row (below header, bg-surface, px-6 py-4), main content area; conditionally renders PatientCardGrid (cards view), PatientTable placeholder (table view), PatientMap placeholder (map view) based on useUIStore.doctorViewMode; wire patient card "Open" to set selectedPatientId; DrillDownPanel rendered as right sidebar (placeholder for Phase 9)

**Checkpoint**: `/doctor` shows KPI row (2 red, 3 yellow, 1 no-data, 5 appts), 10 patient cards in grid with correct risk colours and AI labels, filter and search work, view toggle buttons switch between card grid and placeholders.

---

## Phase 6: User Story 2 — Caregiver Trend Charts (Priority: P2)

**Goal**: Ana can view BP, HR, and medication adherence trend charts with toggleable 7/14/30-day ranges, reference bands, missing data markers, and daily/rolling average toggle.

**Independent Test**: Scroll to charts section on `/caregiver` → see 3 charts rendered with mock data; clicking "14D" on BP chart shows 14 days of data; missing days show visual gap; reference band labelled "Target range"; toggle "Rolling avg" shows smoothed line.

- [ ] T061 [US2] Create `assurecare-portal/src/components/shared/TrendChart.tsx` — Recharts-based responsive chart component accepting `TrendChartProps` from contracts/mock-data.md; uses `<ResponsiveContainer>` + `<LineChart>` or `<AreaChart>`; features: time-range toggle buttons (7D / 14D / 30D) above chart; view mode toggle (Daily / Rolling Avg) as small pills; reference band via `<ReferenceArea>` with a soft colour fill and text label ("Target range"); missing data: null values cause line gap (connectNulls=false); custom dot: outlier points rendered as red `⚠` shape using `<Dot>` customization; tooltip showing date + value; X-axis: abbreviated date labels; Y-axis: auto-scaled with padding; chart height 240px; title + unit in header
- [ ] T062 [US2] Create `assurecare-portal/src/components/caregiver/TrendChartsSection.tsx` — section component with heading "Health Trends"; renders 3 TrendChart instances side by side (or stacked on mobile): (1) Blood Pressure Systolic (reference band 90–130 mmHg "Normal range"), (2) Heart Rate (reference band 60–100 bpm), (3) Medication Adherence (0–100%, reference band 80–100% "Target"); shares a single time-range toggle state across all 3 charts (global range selector above the 3 charts); uses `useVitalsHistory` and `useAdherenceHistory` hooks for data
- [ ] T063 [US2] Wire TrendChartsSection in CaregiverPage — add after AISummary section with section heading; section anchor `id="trends"` for scroll navigation

**Checkpoint**: Charts render with correct mock data. Toggle 7D/14D/30D updates all charts. Missing days show gaps. Reference bands are visible and labelled. Rolling avg toggle shows smoothed line.

---

## Phase 7: User Story 3 — Caregiver Alert Timeline (Priority: P2)

**Goal**: Ana can see a structured chronological event timeline covering the last 7–14 days with expandable events grouped by day — no raw transcripts.

**Independent Test**: Scroll to timeline on `/caregiver` → see events from last 14 days sorted by date; expand a "Missed evening meds" event → see time, category, description, source "chatbot"; doctor notes show as read-only with a lock icon.

- [ ] T064 [US3] Create `assurecare-portal/src/components/shared/AlertTimeline.tsx` — component accepting `AlertTimelineProps` from contracts/mock-data.md; renders events grouped by day (date header "Wednesday, Feb 24"); each event: left column with category icon (pill=meds, heart=vitals, face=symptom, wifi-off=no response, phone=caregiver action, stethoscope=doctor action, calendar=appointment, arrow-up=escalation) coloured by severity; right column: event title (bold), short description, source chip ("Chatbot" / "Caregiver" / "Doctor" / "System"); expandable via chevron → shows full details + optional notes; read-only lock icon on doctor actions/notes visible to caregiver role; timeline line (1px vertical border) connecting events; days-back toggle (7 days / 14 days) above timeline
- [ ] T065 [US3] Wire AlertTimeline in CaregiverPage — use `useTimeline("patient-001", 14)` hook to get merged events; render after TrendChartsSection; section heading "Recent Activity"; section anchor `id="timeline"`

**Checkpoint**: Timeline shows at least 10 events across last 14 days. Events grouped by day. Expand works. Categories correctly coloured. Source chips visible. Doctor note shows lock icon.

---

## Phase 8: User Story 4 — Caregiver Escalation & Appointment Flow (Priority: P2)

**Goal**: Ana can request an appointment (with AI summary pre-filled), escalate non-urgently to Dr. Chan, and send a message to Ms. Tan's chatbot device — all actions are logged.

**Independent Test**: Click "Request appointment" → form opens with AI snippet pre-filled → submit → appointment appears in list with "Requested" status. Click "Escalate" → confirmation → appears in escalation log. Click "Message" → compose form → send → appears in messages with "Sent" status.

### 8A: Messaging Modal

- [ ] T066 [P] [US4] Create `assurecare-portal/src/components/shared/MessagingModal.tsx` — shadcn/ui Dialog; header "Send Message to Ms. Tan's Device"; body: message type toggle (Free text / Template); template dropdown if template selected (options: "Please remember to take your evening medication", "Your check-in is due — please respond when ready", "Dr. Chan has sent you a message"); free text: textarea max 280 chars with character counter; preview box showing how message will appear; send button; on send: adds to usePatientStore messages, logs `message_sent` to actionLogStore, shows "Message queued successfully" toast; close button

### 8B: Escalation Panel

- [ ] T067 [P] [US4] Create `assurecare-portal/src/components/shared/EscalationPanel.tsx` — shadcn/ui Sheet (right side drawer); header "Escalation & Appointments"; two tabs: "Appointments" and "Escalation"; Appointments tab: shows next appointment card (if any) with date/time/status/reason, then "Request Appointment with Dr. Chan" button below; Escalation tab: "Escalate to Dr. Chan (Non-urgent)" button with description, then escalation history list showing past escalations with outcome badges

### 8C: Appointment Request Form

- [ ] T068 [US4] Create `assurecare-portal/src/components/shared/AppointmentRequestForm.tsx` — shadcn/ui Dialog; title "Request Appointment with Dr. Chan"; form fields: Reason dropdown (Routine follow-up / BP concern / Medication review / Symptom check / Other), Preferred time windows (3 checkbox options: "Morning weekdays", "Afternoon weekdays", "Weekend morning"), Notes textarea (pre-filled with AI summary snippet from latest AISummary using `aiSummarySnippet` field), "Include AI summary" checkbox (checked by default); submit button "Send Request"; on submit: calls `useAppointmentStore.requestAppointment(...)`, logs `appointment_requested` to actionLogStore, shows success toast "Appointment request sent to Dr. Chan's clinic"; cancel button
- [ ] T069 [US4] Create `assurecare-portal/src/components/caregiver/EscalationConfirmDialog.tsx` — shadcn/ui AlertDialog for escalation confirmation; title "Escalate to Dr. Chan?"; body: "This will notify Dr. Chan that Ms. Tan needs non-urgent attention. Reason codes: [chips]"; confirm button "Yes, escalate"; on confirm: adds EscalationRecord to usePatientStore, logs `escalation_created` to actionLogStore, shows toast "Escalation sent to Dr. Chan"; reason codes auto-derived from latest open alert

### 8D: Care Plan & Notes

- [ ] T070 [P] [US4] Create `assurecare-portal/src/components/caregiver/CarePlanChecklist.tsx` — read-only checklist displaying Ms. Tan's care plan items from `MOCK_CARE_PLAN`; each item: checkbox (visual only, not interactive for caregiver), item description, frequency badge; header "Care Plan" with doctor attribution "Set by Dr. Chan"; note at bottom: "Contact Dr. Chan to update care plan"
- [ ] T071 [P] [US4] Create `assurecare-portal/src/components/caregiver/NotesPanel.tsx` — two sections: (1) "Doctor's Notes" — read-only list of DoctorNote entries from patient store, each showing content + date + "Dr. Chan" attribution + lock icon; (2) "My Notes" — list of CaregiverNote entries + "Add note" button that opens a small inline textarea; on save: adds CaregiverNote to store, logs `note_added` to actionLogStore
- [ ] T072 [US4] Wire all escalation/appointment/notes components in CaregiverPage — add EscalationPanel (Sheet triggered by QuickActions "Escalate/Book" button and explicit "Escalation" section below timeline); add MessagingModal (triggered by "Message" quick action); add NotesPanel and CarePlanChecklist below timeline in a two-column layout; section heading "Notes & Care Plan"; section anchor `id="notes"`

**Checkpoint**: Full caregiver page complete. All 4 quick-action buttons work. Appointment request form pre-fills AI snippet, submits and shows in appointments list. Escalation confirm dialog logs entry. Message modal sends and shows toast. Care plan displays read-only. Notes panel allows adding caregiver notes.

---

## Phase 9: User Story 6 — Doctor Patient Drill-Down (Priority: P2)

**Goal**: Clicking a patient card in the Doctor panel opens a right-side panel with risk banner, vitals charts, alert timeline, clinical AI summary, doctor notes editor, appointment scheduling, and caregiver contact info.

**Independent Test**: Click Ms. Tan's card → drill-down panel slides in → shows yellow risk banner with explainability, 2 Recharts line charts (BP, HR), 5-event timeline, "Clinical Summary" AI text, notes editor (add note → appears), schedule appointment form.

- [ ] T073 [US6] Create `assurecare-portal/src/components/doctor/DrillDownPanel.tsx` — shadcn/ui Sheet (right, width 680px) that opens when `useUIStore.selectedPatientId` is set; header: patient name + age + close (X) button; tab navigation inside panel: "Overview" / "Charts" / "Timeline" / "Notes & Actions"; always-visible: RiskBanner (compact variant, showDetailedScoring=true) at top; tab content rendered below; uses `usePatient(selectedPatientId)` for all data
- [ ] T074 [P] [US6] Create `assurecare-portal/src/components/doctor/DrillDownOverview.tsx` — Overview tab content: mini vitals snapshot (latest BP/HR/date), adherence last 7 days dots row, active symptoms chips, caregiver info card ("Primary Caregiver: Ana | +65-9111-2222 | ana@family.sg"), upcoming appointments list; "Schedule appointment" button and "Send follow-up message" button
- [ ] T075 [P] [US6] Create `assurecare-portal/src/components/doctor/DrillDownCharts.tsx` — Charts tab: reuses TrendChart component for BP systolic, BP diastolic, HR; shared time-range toggle (7D/14D/30D); charts stacked vertically in panel; same features as caregiver charts
- [ ] T076 [P] [US6] Create `assurecare-portal/src/components/doctor/DrillDownTimeline.tsx` — Timeline tab: reuses AlertTimeline component with `role="doctor"` (shows all events including unverified vitals badge visible to doctor); "Mark reviewed" button at top logs `mark_reviewed` action
- [ ] T077 [US6] Create `assurecare-portal/src/components/doctor/DoctorNotesEditor.tsx` — Notes tab content: (1) Clinical AI Summary card — AISummary with `summaryType="clinical"` variant (more clinical language, shows full narrative paragraph + evidence pointers); (2) "Doctor's Notes" section — list of existing DoctorNote entries (content, date, edit pencil icon); "Add Clinical Note" button → inline textarea + save; on save: adds DoctorNote to store, logs `note_added` to actionLogStore; (3) "Appointment" section — current appointment status card + "Schedule Appointment" button → AppointmentScheduleForm
- [ ] T078 [P] [US6] Create `assurecare-portal/src/components/doctor/AppointmentScheduleForm.tsx` — doctor version of appointment form (shadow/Dialog); fields: Appointment date/time (date input + time select), Reason dropdown (all `AppointmentReason` values), Pre-visit instructions textarea, "Attach AI summary" checkbox; submit calls `useAppointmentStore.scheduleAppointment(...)`, logs `appointment_scheduled`
- [ ] T079 [US6] Create `assurecare-portal/src/components/doctor/RiskScoreToggle.tsx` — small "Show scoring detail" toggle switch (visible only in doctor view); when enabled shows score breakdown table: each reason code, its weight/score, total score, risk threshold; uses `computeRiskStatus()` output `scoreBreakdown`; renders inside RiskBanner when `showDetailedScoring=true` and role=doctor
- [ ] T080 [US6] Wire DrillDownPanel in DoctorPage — render `<DrillDownPanel />` always in DoctorPage (Sheet visibility controlled by `selectedPatientId !== null`); clicking patient card "Open" or card body sets selectedPatientId; closing panel clears selectedPatientId; panel logs `patient_viewed` on open

**Checkpoint**: Clicking any patient card opens right-side panel with all tabs functional. Risk banner shows in panel. Charts render inside panel. Notes editor adds entries. Appointment schedule form works. Score toggle shows breakdown.

---

## Phase 10: User Story 7 — Doctor Table & Map Views (Priority: P3)

**Goal**: Dr. Chan can switch to Table view (with bulk actions) and Map view (with risk-coloured pins, hover summaries, and click-to-open drill-down).

**Independent Test**: Switch to Table view → see 10-row table with sortable columns and checkboxes; select 3 patients → bulk action bar appears. Switch to Map view → see 9 pins (Mrs. Chong excluded, no location) on Singapore map, coloured by risk; hover Ms. Tan's pin → mini summary popup appears; click → DrillDownPanel opens.

### 10A: Table View

- [ ] T081 [US7] Create `assurecare-portal/src/components/doctor/PatientTable.tsx` — shadcn/ui Table-based component; columns: checkbox (multi-select), Patient (name + age + risk badge), Risk Reason (top reason code in human label), Last Update (relative time), Next Appointment (date or "None"), Actions (Open / Schedule / Note buttons); multi-select: when ≥1 checked, show bulk action bar above table: "Message selected (N)", "Schedule follow-ups", "Mark reviewed"; clicking "Message selected" opens MessagingModal with patient count in header; clicking "Mark reviewed" logs `mark_reviewed` for all selected; applies same search/filter/sort from useUIStore; row click = open DrillDownPanel

### 10B: Map View

- [ ] T082 [US7] Create `assurecare-portal/src/components/doctor/PatientMap.tsx` — react-leaflet `<MapContainer>` centred on Singapore (1.3521, 103.8198), zoom 12, with OpenStreetMap tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`); renders a `<CircleMarker>` for each patient with location data; marker fillColor: danger red (#DC2626) for red, warning amber (#D97706) for yellow, safe green (#16A34A) for green; radius 12; on hover: `<Popup>` showing mini summary card (patient name, risk badge, AI label, latest BP/HR); on click: sets useUIStore.selectedPatientId to open DrillDownPanel; applies active filters from useUIStore (patients filtered out = pins hidden); footer note "9 of 10 patients shown (1 has no location data)" if some excluded

### 10C: View Switching

- [ ] T083 [US7] Wire view switching in DoctorPage — ensure DoctorPage conditionally renders PatientCardGrid / PatientTable / PatientMap based on `useUIStore.doctorViewMode`; view toggle buttons in DoctorHeader update the store; all three views share the same filter/search/sort state; DrillDownPanel appears over any view

**Checkpoint**: Table view renders 10 rows, multi-select bulk actions work. Map view shows 9 pins on Singapore map coloured by risk. Hover popups and click-to-drilldown work. Filters apply to map pins.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Visual polish, accessibility, empty states, error states, responsiveness, and UX consistency across all views.

- [ ] T084 [P] Add loading skeleton states — create `assurecare-portal/src/components/shared/SkeletonCard.tsx` and `SkeletonTile.tsx` using shadcn/ui Skeleton; display for 500ms on initial mount to simulate async load (simulate with setTimeout in seedStores); apply to CaregiverPage tiles and DoctorPage card grid
- [ ] T085 [P] Add toast notifications — install and configure `sonner` toast library in `assurecare-portal/`; add `<Toaster />` to App.tsx; replace all placeholder "success" states in appointment request, escalation, message send, note add with `toast.success(...)` calls; add `toast.error(...)` for simulated failure states
- [ ] T086 [P] Add empty and error states — in CaregiverPage: "No data available today" grey card if latest vitals is null; in DoctorPage card grid: "No patients match your filters" empty state with reset-filters button; in AlertTimeline: "No events in the last 14 days" empty state
- [ ] T087 [P] Accessibility pass — audit all interactive elements: ensure all buttons have `aria-label`, all icons used as buttons have `aria-label`, all form inputs have `<label>` or `aria-label`; add `role="status"` to toast container; ensure risk badges have text not just colour (already satisfied by label text); add `aria-expanded` to expandable sections in RiskBanner and AlertTimeline
- [ ] T088 [P] Responsive layout — audit CaregiverPage at 1024px viewport: header stacks to 2 rows if needed, TodayGlance grid becomes 2-col, charts stack vertically; DoctorPage: card grid becomes 2-col at 1024px; DrillDownPanel full-width overlay on viewports < 768px
- [ ] T089 [P] Visual consistency pass — ensure consistent spacing (section gaps 32px), consistent section heading style (text-xl font-semibold text-gray-900 border-b pb-3 mb-6), consistent card shadow levels (shadow-sm default, shadow-md on hover), consistent colour usage (no ad-hoc colour hex strings — all via Tailwind config tokens or getRiskColor utility)
- [ ] T090 [P] Data freshness indicator — add a "Data as of: Feb 25, 2026 09:05 · Next check-in expected: Feb 26, 2026 ~08:00" footer bar on CaregiverPage (below notes section); light grey bar, small text; for Mrs. Chong on Doctor panel, show "No data for 3 days" banner on her card with amber background
- [ ] T091 Update `assurecare-portal/src/pages/CaregiverPage.tsx` — add section anchor scroll navigation sidebar (desktop only): floating right sidebar with 5 anchors (Today, Trends, Activity, Escalation, Notes) that highlight as user scrolls through sections; uses IntersectionObserver
- [ ] T092 Final integration check — verify all mock scenarios from data-model.md are demonstrable: (1) Yellow scenario: Ms. Tan dashboard shows yellow banner with BP trend + missed meds evidence; (2) Red scenario: Mr. Lim drill-down shows red banner + severe symptom; (3) Doctor panel: 2 red, 3 yellow, 1 no-data KPI counts correct; (4) Appointment flow: Ana requests → appears in appointments list with "Requested" status

**Checkpoint**: Full portal polished and demo-ready. All 4 required mock scenarios work. Toasts fire correctly. Empty states visible. Skeleton loading on mount. Accessible markup.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user story phases
- **Phase 3 (US8 Navigation)**: Depends on Phase 2 — must complete before US1 and US5
- **Phase 4 (US1 Caregiver Dashboard)**: Depends on Phase 3
- **Phase 5 (US5 Doctor Panel)**: Depends on Phase 3 — can run in parallel with Phase 4
- **Phase 6 (US2 Charts)**: Depends on Phase 4 (adds to CaregiverPage)
- **Phase 7 (US3 Timeline)**: Depends on Phase 4 — can run in parallel with Phase 6
- **Phase 8 (US4 Escalation)**: Depends on Phase 4 — can run in parallel with Phases 6 & 7
- **Phase 9 (US6 Drill-Down)**: Depends on Phase 5 — can run in parallel with Phases 6–8
- **Phase 10 (US7 Table/Map)**: Depends on Phase 5 & 9
- **Phase 11 (Polish)**: Depends on all phases complete

### User Story Dependencies

- **US8 (Navigation)** → foundational, must come first
- **US1, US5** → both depend on US8, can be parallel
- **US2, US3, US4** → all depend on US1 (add to CaregiverPage), can be parallel to each other
- **US6** → depends on US5 (adds to DoctorPage drill-down)
- **US7** → depends on US5 and US6

### Parallel Opportunities

Within Phase 2: T014–T027 (mock data files) all parallel after types (T014); T028–T031 (stores) parallel after data files; T032–T035 (lib/utils) parallel with stores
Within Phase 4: T047 (QuickActions), T048 (EmergencyDialog) parallel; T049 (RiskBanner) + T051 (MetricTile) parallel
Within Phase 5: T056 (KPICounters) + T057 (DoctorHeader) + T058 (PatientCard) all parallel
Within Phase 8: T066, T070, T071 all [P] parallel
Within Phase 9: T074, T075, T076, T078 all [P] parallel
Within Phase 11: T084–T091 all [P] parallel

---

## Parallel Examples

### Phase 2 — Parallel mock data creation
```
T015 patients.ts  ←parallel→  T016 vitals.ts
T017 adherence.ts ←parallel→  T018 symptoms.ts
T019 alerts.ts    ←parallel→  T020 aiSummaries.ts
T021 appointments ←parallel→  T022 actionLog.ts
```

### Phase 4 & 5 — After Phase 3 complete (parallel stories)
```
Phase 4 (Caregiver US1)  ←parallel→  Phase 5 (Doctor US5)
```

### Phase 6, 7, 8 — After Phase 4 complete (parallel additions to CaregiverPage)
```
Phase 6 (Charts) ←parallel→  Phase 7 (Timeline) ←parallel→  Phase 8 (Escalation)
```

---

## Implementation Strategy

### MVP First (US8 + US1 + US5)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US8 Navigation
4. Complete Phase 4: US1 Caregiver Dashboard
5. Complete Phase 5: US5 Doctor Panel
6. **STOP and VALIDATE**: Both dashboards show correct mock data, role switching works, risk banner and tiles display correctly
7. Demo-ready at this point

### Incremental Delivery

1. Setup + Foundational → skeleton working
2. + US8 → role switching works
3. + US1 → complete caregiver daily view (MVP for Ana)
4. + US5 → complete doctor panel (MVP for Dr. Chan)
5. + US2 → charts added to caregiver view
6. + US3 → timeline added
7. + US4 → escalation/appointment flows complete
8. + US6 → doctor drill-down complete
9. + US7 → table and map views
10. + Polish → production-quality demo

---

## Notes

- [P] tasks = different files, no dependencies on incomplete sibling tasks in same phase
- [Story] label maps each task to spec.md user story for traceability
- Commit after each phase checkpoint at minimum; ideally after each logical task group
- All mock data files are the single source of truth — do not hard-code values in components
- shadcn/ui components go in `src/components/ui/` — do not modify them; compose from them
- All action-logging calls must use `useActionLogStore.logAction(...)` helper consistently
- Risk colours must always use `getRiskColor()` / `getRiskBgColor()` from utils.ts — never raw hex
