# Feature Specification: AssureCare Portal Frontend

**Feature Branch**: `001-assurecare-frontend`
**Created**: 2026-02-25
**Status**: Draft
**Input**: React JS frontend for AssureCare Portal with Caregiver View and Doctor View, modern clean design, all data mocked.

---

## Overview

Build a modern, clean React JS web portal with two primary views — **Caregiver View** (for Ana monitoring Ms. Tan) and **Doctor View** (for Dr. Chan managing a patient panel). All data is mocked. The portal surfaces structured daily insights from a home voice chatbot (AssureCare Home) and supports risk triage, escalation, appointment scheduling, and care coordination.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Caregiver Daily Dashboard (Priority: P1)

Ana (daughter/caregiver) opens the portal and immediately understands Ms. Tan's current health status. She sees a risk banner (Green/Yellow/Red), key vitals tiles, today's adherence snapshot, and an AI-generated summary explaining why the status is what it is. She can take action directly from the dashboard.

**Why this priority**: This is the core daily use case that delivers the most immediate value — giving a family caregiver peace of mind or a call to action. Without this, there is no portal.

**Independent Test**: Navigate to the Caregiver tab; verify risk banner, tiles, AI summary, and alert timeline are all visible with meaningful mock data for Ms. Tan.

**Acceptance Scenarios**:

1. **Given** Ana is on the Caregiver tab, **When** the page loads, **Then** she sees a sticky header with Ms. Tan's identity (name, age, conditions), primary caregiver name, doctor contact, and four quick-action buttons (Call, Message, Escalate/Book, Emergency).
2. **Given** the page loads, **When** the risk banner renders, **Then** it displays the current risk level (Red/Yellow/Green), up to 3 plain-language reason drivers, last-updated timestamp, and data freshness indicator.
3. **Given** the dashboard is visible, **When** Ana reviews "Today at a Glance", **Then** she sees 4–6 tiles covering medication adherence, BP/HR, symptoms, exercise, mood, and engagement — each showing current state, last-updated time, and a tooltip explanation.
4. **Given** the dashboard is visible, **When** Ana clicks "Learn more" on a tile, **Then** a tooltip/popover displays a plain-language explanation of the metric.
5. **Given** the dashboard is visible, **When** Ana views the AI Summary section, **Then** she sees 3–5 daily highlight bullets, a plain-language explanation of the risk colour, caregiver action prompts (supportive, not medical advice), and a confidence/freshness stamp.

---

### User Story 2 - Caregiver Trend Charts (Priority: P2)

Ana views BP, HR, and medication adherence trend charts over 7, 14, or 30 days to understand whether Ms. Tan is improving or deteriorating over time.

**Why this priority**: Trends provide the "why" behind today's status and help caregivers have informed conversations with doctors.

**Independent Test**: On the Caregiver tab, scroll to the trend charts section; verify BP, HR, and adherence charts render with toggleable time ranges and informational target bands.

**Acceptance Scenarios**:

1. **Given** Ana is on the dashboard, **When** she views the trend charts section, **Then** BP trend, HR trend, and medication adherence trend charts are visible.
2. **Given** a trend chart is visible, **When** Ana toggles between 7 / 14 / 30 day ranges, **Then** the chart updates to reflect the selected date range.
3. **Given** a chart renders, **When** data is missing for a day, **Then** a visual marker (e.g., gap or dot) indicates missing data.
4. **Given** a chart renders, **When** it displays informational target bands, **Then** those bands are labelled as informational/reference only (non-prescriptive).

---

### User Story 3 - Caregiver Alert Timeline (Priority: P2)

Ana reviews a structured event timeline covering the last 7–14 days, showing meds taken/missed, vitals recorded, symptom flags, non-responses, caregiver actions, and doctor actions — all without raw transcript content.

**Why this priority**: The timeline provides chronological evidence for the risk status and helps Ana recall what has happened recently.

**Independent Test**: Scroll to the alert timeline on the Caregiver tab; verify events are listed with category, short description, source, and expandable details.

**Acceptance Scenarios**:

1. **Given** the alert timeline is visible, **When** Ana views it, **Then** events from the last 7–14 days are listed with date/time, category icon, short description, and source label (chatbot/caregiver/doctor).
2. **Given** an event is listed, **When** Ana expands it, **Then** she sees time, category, short description, source, and optional notes.
3. **Given** the timeline renders, **When** it shows doctor notes or actions, **Then** they are displayed read-only (no edit controls for caregiver).

---

### User Story 4 - Caregiver Escalation & Appointment Flow (Priority: P2)

Ana can request an appointment with Dr. Chan (with reason and optional notes, auto-filled with AI summary snippet) and escalate the case non-urgently to the doctor. All actions are logged.

**Why this priority**: Enables the key action loop — from insight to intervention — which is the portal's core value proposition.

**Independent Test**: Click "Escalate / Book Appointment" from the header or escalation panel; complete the appointment request form and verify a mock confirmation is shown and the action appears in the audit log.

**Acceptance Scenarios**:

1. **Given** Ana is on the dashboard, **When** she opens the Appointments sub-panel, **Then** she sees the next upcoming appointment (if any) and a "Request appointment with Dr. Chan" button.
2. **Given** Ana clicks to request an appointment, **When** she fills in the reason dropdown, optional notes, and preferred time windows, **Then** she can submit the request; it appears with "Requested" status.
3. **Given** the appointment form is open, **When** it renders, **Then** an AI summary snippet is pre-populated in the notes field (editable).
4. **Given** Ana is on the escalation sub-panel, **When** she clicks "Escalate to Doctor (non-urgent)", **Then** she can confirm the escalation, it is logged, and a confirmation message is shown.
5. **Given** a quick action button "Emergency" is clicked, **Then** a static guidance panel appears showing instructions and emergency contacts (no auto-dial).

---

### User Story 5 - Doctor Panel Triage Dashboard (Priority: P1)

Dr. Chan opens the Doctor tab and sees a panel of 10 mock patients sorted by risk severity. He can filter by risk level, see KPI counters, and quickly identify which patients need immediate attention.

**Why this priority**: This is the core use case for the clinician role — enabling efficient triage across a patient panel.

**Independent Test**: Navigate to the Doctor tab; verify the KPI counters, patient cards grid with risk badges, and filter/sort controls all render with 10 mock patients (2 red, 3 yellow, 1 no-data, rest green).

**Acceptance Scenarios**:

1. **Given** Dr. Chan is on the Doctor tab, **When** the page loads, **Then** KPI counters show: Red alerts today, Yellow watchlist count, No data >48h count, Appointments next 7 days — all clickable to apply the corresponding filter.
2. **Given** the panel loads, **When** the default card view is shown, **Then** each patient card displays: name/age, risk badge with AI label, data freshness, latest BP/HR, 7-day adherence snapshot, symptom icons, next appointment.
3. **Given** filter chips are visible (Red, Yellow, No data >48h, Post-discharge, Hypertension), **When** Dr. Chan clicks a chip, **Then** the patient list filters accordingly.
4. **Given** the panel is visible, **When** Dr. Chan uses the search bar, **Then** patients matching by name are shown.
5. **Given** a patient card is visible, **When** Dr. Chan clicks card actions (Open, Follow-up, Schedule, Add note), **Then** the appropriate modal/panel opens.

---

### User Story 6 - Doctor Patient Drill-Down (Priority: P2)

Dr. Chan clicks on a patient card to open a detailed drill-down panel with risk banner, vitals charts, alert timeline, AI clinical summary, notes editor, and appointment scheduling.

**Why this priority**: Provides the clinical depth needed for informed decision-making on individual patients.

**Independent Test**: Click on Ms. Tan's patient card; verify the drill-down panel opens with all sections populated with mock data.

**Acceptance Scenarios**:

1. **Given** Dr. Chan clicks a patient card, **When** the drill-down opens, **Then** it shows: risk banner with explainability, vitals trend charts, alert timeline, AI clinical summary, doctor notes editor, appointment scheduling, and caregiver contact info.
2. **Given** the drill-down is open, **When** Dr. Chan adds a clinical note, **Then** the note appears in the notes list with timestamp and author.
3. **Given** the drill-down is open, **When** Dr. Chan schedules an appointment, **Then** the appointment appears in the patient's appointments list with "Scheduled" status.
4. **Given** the risk banner is visible, **When** Dr. Chan clicks "Why this status?", **Then** the explainability panel expands showing reason codes mapped to plain language with evidence pointers (dates, readings).

---

### User Story 7 - Doctor Table & Map Views (Priority: P3)

Dr. Chan can switch between Card view, Table (watchlist) view, and Map view to manage his panel in different contexts.

**Why this priority**: Different workflows (quick triage vs geographic overview vs bulk actions) are served by different views.

**Independent Test**: Toggle between Card/Table/Map views; verify each renders the patient list with appropriate columns/pins/actions.

**Acceptance Scenarios**:

1. **Given** the Doctor panel is visible, **When** Dr. Chan switches to Table view, **Then** a table shows columns: Patient, Risk, Reason, Last Update, Next Appointment, Actions with bulk-action checkboxes.
2. **Given** the Table view is active, **When** Dr. Chan selects multiple patients, **Then** bulk action buttons appear (Message selected, Schedule follow-ups, Mark reviewed).
3. **Given** Dr. Chan switches to Map view, **Then** patient location pins appear colour-coded by risk level; hovering a pin shows a mini summary; clicking opens the drill-down panel.

---

### User Story 8 - Mock Login & Role-Based Navigation (Priority: P1)

The portal shows two tabs (Caregiver / Doctor) accessible via mock login or direct tab switching, enforcing role-based views.

**Why this priority**: Role separation is foundational — without it, the correct views cannot be tested or demonstrated.

**Independent Test**: Click Caregiver tab → verify single-patient view. Click Doctor tab → verify multi-patient panel. No cross-role data leaks (e.g., no multi-patient view in Caregiver tab).

**Acceptance Scenarios**:

1. **Given** the app loads, **When** the user selects "Caregiver (Ana)" role/tab, **Then** the single-patient dashboard for Ms. Tan is shown with caregiver-appropriate permissions only.
2. **Given** the app loads, **When** the user selects "Doctor (Dr. Chan)" role/tab, **Then** the multi-patient panel dashboard is shown with doctor-appropriate permissions.
3. **Given** the Caregiver view is active, **Then** multi-patient panel, map view, and doctor notes editing are not available.

---

### Edge Cases

- What happens when a day's check-in data is missing? → Show a "No data" indicator on tiles and charts; the timeline shows a "Missed check-in" event.
- What happens when all patients are green (no alerts)? → KPI counters show 0; the panel still lists all patients.
- What happens if an appointment request is submitted with no reason selected? → Inline validation error is shown; form does not submit.
- What happens when the map has patients with no location data? → Those patients are omitted from the map view with an info note ("X patients have no location data").
- What happens when the AI summary has low confidence? → A "Low confidence" badge is shown on the summary; tooltip explains what this means.
- What happens when risk status transitions from Yellow to Red? → The banner updates colour and drivers; a new alert entry appears in the timeline.

---

## Requirements *(mandatory)*

### Functional Requirements

**Authentication & Navigation**

- **FR-001**: The portal MUST provide two clearly labelled role views: Caregiver (Ana) and Doctor (Dr. Chan), accessible via tab switching or mock login selection.
- **FR-002**: The Caregiver view MUST be restricted to single-patient context (Ms. Tan) with no access to multi-patient panel features.
- **FR-003**: The Doctor view MUST provide access to the full patient panel, map view, table view, and clinical note editing.

**Caregiver View**

- **FR-004**: The Caregiver view MUST display a sticky header with patient identity (Ms. Tan, age 68, conditions), primary caregiver name (Ana), doctor contact (Dr. Chan), and four quick-action buttons: Call Ms. Tan, Message via chatbot, Escalate/Book appointment, Emergency guidance.
- **FR-005**: The Caregiver view MUST display a full-width risk status banner showing: current risk level (Green/Yellow/Red), top 1–3 plain-language risk drivers, last-updated timestamp, and data freshness indicator.
- **FR-006**: The risk banner MUST include an expandable "Why this status?" explainability panel listing reason codes mapped to human-readable evidence (e.g., "BP increased from 130 to 148 over last 5 days").
- **FR-007**: The "Today at a Glance" section MUST display 4–6 metric tiles covering: medication adherence (today + 7-day streak), BP/HR (latest + trend arrow), symptoms (none/flags + severity), exercise/activity, mood/wellbeing, engagement/responsiveness.
- **FR-008**: Each metric tile MUST show current state, last-updated time, and a "Learn more" tooltip with a plain-language explanation for non-clinical users.
- **FR-009**: The trend charts section MUST include BP trend, HR trend, and medication adherence trend charts with toggleable 7/14/30-day date ranges.
- **FR-010**: Charts MUST display missing data markers, informational target bands (labelled as non-prescriptive), and toggle between daily points and rolling average views.
- **FR-011**: The AI Summary section ("Key Things to Note") MUST display: 3–5 daily highlight bullets, a plain-language explanation of the risk colour, supportive caregiver action prompts (not medical advice), and a confidence/freshness stamp.
- **FR-012**: The alert timeline MUST show structured events from the last 7–14 days including: meds taken/missed, vitals recorded, symptom flags, non-response events, caregiver actions, doctor actions — with no raw transcript content.
- **FR-013**: Each timeline event MUST be expandable to show: time, category, short description, source (chatbot/caregiver/doctor), and optional notes.
- **FR-014**: The Appointments sub-panel MUST show next upcoming appointment, a "Request appointment with Dr. Chan" button, a reason dropdown, optional notes field, and an AI summary snippet auto-populated in the notes (editable).
- **FR-015**: The Escalation sub-panel MUST include: "Escalate to Doctor (non-urgent)" button, optional backup contact escalation, and all escalation actions must be logged.
- **FR-016**: The Emergency guidance panel MUST show static guidance text and emergency contacts without triggering any auto-call.
- **FR-017**: The Notes section MUST display doctor notes as read-only to the Caregiver, and allow the Caregiver to add their own notes.
- **FR-018**: A care plan checklist MUST be visible to the Caregiver as read-only.

**Doctor View**

- **FR-019**: The Doctor panel MUST display KPI counters at the top for: Red alerts today, Yellow watchlist count, No data >48h count, Appointments next 7 days. Each counter MUST be clickable to apply the corresponding filter.
- **FR-020**: The panel MUST support three view modes: Cards (default), Table, and Map — toggled via view controls.
- **FR-021**: The panel MUST support filter chips: Red, Yellow, No data >48h, Post-discharge, Hypertension; sort controls: risk descending, newest alerts, upcoming appointments; and a search bar by patient name/ID.
- **FR-022**: Each patient card in Card view MUST display: patient name/age, risk badge with concise AI label (e.g., "BP rising + missed meds"), data freshness, latest BP/HR, 7-day adherence snapshot, symptom icon(s), next appointment.
- **FR-023**: Each patient card MUST have action buttons: Open patient details, Request follow-up, Schedule appointment, Add note, Mark reviewed.
- **FR-024**: Table view MUST show columns: Patient, Risk, Reason, Last Update, Next Appointment, Actions; with multi-select checkboxes supporting bulk actions: Message selected, Schedule follow-ups, Assign, Mark reviewed.
- **FR-025**: Map view MUST display patient location pins colour-coded by risk level; hovering a pin MUST show a mini summary; clicking a pin MUST open the patient drill-down panel. Filters MUST apply to the map.
- **FR-026**: The patient drill-down panel (doctor) MUST include: risk banner with explainability, vitals trend charts, alert timeline, AI clinical summary, doctor notes editor (add/edit), appointment scheduling, and caregiver contact info (Ana).
- **FR-027**: The doctor notes editor MUST allow creating and saving clinical notes, each persisted with timestamp and author.
- **FR-028**: The Doctor view MUST include a "Detailed scoring" toggle (for clinicians only) that reveals underlying risk score components without exposing proprietary weights.

**Mock Data**

- **FR-029**: All data MUST be mocked locally; no real backend is required.
- **FR-030**: Mock data MUST include at minimum: 10 patients (2 red, 3 yellow, 1 no-data, 4 green); Ms. Tan as the primary caregiver patient with a 30-day vitals history showing deterioration trends, missed meds, symptom flags.
- **FR-031**: Mock scenarios MUST cover: (1) Yellow risk due to rising BP + missed meds, (2) Red risk due to severe symptom flag + no response, (3) An appointment request by Ana confirmed by Dr. Chan.
- **FR-032**: The mock AI summaries MUST include evidence pointers (e.g., "BP increased from 130 to 148 over last 5 days", "Missed evening meds on Feb 23").

**General UI/UX**

- **FR-033**: The portal MUST have a modern, clean visual design with adequate colour contrast, large click targets, and readable chart labels meeting WCAG-inspired baseline accessibility standards.
- **FR-034**: The portal MUST be responsive and usable at standard desktop/laptop screen widths (minimum 1024px).
- **FR-035**: All user actions (escalation, appointment request, note creation, message send, call click) MUST be reflected in an audit/action log viewable in the respective patient's timeline.
- **FR-036**: The portal MUST display appropriate empty states and error indicators: "No data available today", "Missed check-in" markers on charts/timeline.

---

### Key Entities

- **Patient**: Represents a monitored individual. Key attributes: name, age, conditions, assigned doctor, assigned caregiver(s), risk status, location (mocked coordinates for map).
- **Daily Check-in Session**: One record per patient per day. Attributes: date, status (completed/partial/missed), source (chatbot).
- **Vitals Record**: BP (systolic/diastolic), HR (bpm), recorded datetime, data quality flag (normal/unverified/outlier).
- **Adherence Event**: Morning/evening meds taken (yes/no), exercise done (yes/no), hydration done (yes/no), date.
- **Symptom Signal**: Symptom type (e.g., dizziness, chest tightness, shortness of breath), severity (mild/moderate/severe), date.
- **Engagement Signal**: Check-in response time, completion rate, consecutive no-response streak count.
- **Alert**: severity (green/yellow/red), reason codes, evidence pointers (dates/readings), created timestamp, status (open/acknowledged/resolved).
- **AI Summary**: Narrative text, key drivers list, confidence (low/medium/high), generation timestamp, data coverage range, summary type (daily/clinical/pre-visit).
- **Appointment**: Patient, doctor, preferred/scheduled datetime, reason, status (requested/scheduled/completed/cancelled), notes, AI summary snippet.
- **Action Log (Audit)**: Actor (role + name), patient, action type, payload summary, timestamp.
- **Doctor Note**: Author, patient, content, created/updated timestamp, visibility (caregiver: read-only).
- **Caregiver Note**: Author, patient, content, timestamp.
- **Message**: Sender, recipient device (chatbot), content (free text or template), delivery status (queued/sent/failed), timestamp.
- **Escalation Record**: Initiator, patient, reason codes, escalation type, outcome (acknowledged/resolved/pending), timestamp.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A caregiver user can open the dashboard and immediately understand Ms. Tan's current risk status (colour, top reasons, and recommended action) without scrolling — within 5 seconds of page load.
- **SC-002**: The Caregiver dashboard loads and renders all sections (banner, tiles, charts, AI summary, timeline) within 3 seconds on a standard broadband connection.
- **SC-003**: The Doctor panel loads and renders up to 10 patient cards with all risk and vitals data within 3 seconds.
- **SC-004**: 100% of alerts and AI summaries displayed in the UI are traceable to at least one specific evidence pointer (date + reading or event).
- **SC-005**: A caregiver can complete an appointment request (from dashboard → form → confirmation) in under 2 minutes.
- **SC-006**: A doctor can triage (review risk, read AI label, decide action) for a patient card without opening the drill-down in under 30 seconds per card.
- **SC-007**: All role-based permission restrictions are enforced: the Caregiver view exposes zero doctor-exclusive features; the Doctor view exposes all panel and clinical features.
- **SC-008**: All four demo scenarios from the requirements are demonstrable end-to-end using the mock data without any manual intervention.
- **SC-009**: All user actions (escalation, appointment request, note, message, call click) produce a corresponding entry in the audit log visible in the timeline.
- **SC-010**: The portal meets WCAG-inspired baseline: all text passes sufficient contrast ratios, all interactive elements have keyboard-accessible equivalents, chart labels are readable at default font sizes.

---

## Assumptions

1. **No real backend**: All data is mocked in-memory or via static JSON files within the React app. No API calls to external services.
2. **Mock authentication**: Role selection (Caregiver/Doctor) is simulated via tab/toggle; no real session management or token-based auth is required for the demo.
3. **Single caregiver, single patient (Caregiver view)**: The Caregiver view is fixed to Ana monitoring Ms. Tan. Multi-patient caregiver management is out of scope.
4. **Map uses approximate mock coordinates**: Patient locations on the map are fictitious coordinates (Singapore area) used purely for visual demonstration.
5. **Appointment scheduling is fully mocked**: No calendar integration (Google Calendar, clinic system) is required. Status transitions are simulated locally.
6. **Message delivery is mocked**: The "Message via chatbot" feature shows a compose form and simulates sent/queued status; no real chatbot integration.
7. **Call action is a UI shortcut only**: "Call Ms. Tan" logs the action click; no actual phone call is initiated.
8. **AI summaries are pre-authored mock text**: Generated summaries are static mock content with embedded evidence pointers; no live LLM call is required.
9. **Chart library**: A well-supported React charting library (e.g., Recharts, Victory, Chart.js via react-chartjs-2) is freely chosen based on developer preference.
10. **Component library**: A modern UI component library (e.g., shadcn/ui, Ant Design, MUI, Mantine) may be freely used for consistent styling.
11. **Normal ranges on charts**: Informational target bands are shown in charts for both roles (caregiver and doctor) as reference only — not prescriptive clinical guidance.
12. **No notifications (email/SMS/push)**: In-portal alerts and banners are the only notification mechanism for this frontend.

---

## Out of Scope

- Real-time vitals streaming or continuous monitoring
- Direct emergency services activation (automated calling)
- Medication prescribing, dose changes, or clinical orders
- Payments or billing
- Full EHR integration
- Email/SMS/push notifications
- PDF/CSV export (Phase 2)
- Multi-language support (English only for this build)
- MFA or SSO authentication
- Care coordinator / nurse / admin roles
