# AssureCare Portal Requirements (Caregiver + Doctor)

**Product:** AssureCare Portal (Caregiver View + Doctor View)  
**Version:** 1.0 (initial thorough draft)  
**Date:** 2026-02-25  

---

## 1. Purpose

Define the functional and non-functional requirements for a web portal that surfaces **structured daily insights** derived from a **home voice chatbot** (AssureCare Home) for:

1) **Family caregivers** (primary: Ms. Tan’s daughter, Ana) to monitor one loved one and take non-clinical actions (check-ins, reminders, scheduling, escalation).

2) **Clinicians** (primary: Dr. Chan at a local clinic) to manage a **panel** of patients, triage risk, and coordinate follow-ups.

The portal is designed for **mock/demo data** that can show deterioration trends, but the design must remain compatible with real-world implementation later.

---

## 2. Background & Context

### 2.1 Patient persona (monitored individual)
- **Name:** Ms. Tan
- **Age:** 68
- **Living situation:** living alone on weekday mornings
- **Conditions:** hypertension; **past mild heart attack last week**
- **Primary family caregiver contact:** Ana (daughter)
- **Doctor:** Dr. Chan at a local clinic (contactable if needed)

### 2.2 Data source characteristics
- **Not live monitoring.**
- The **chatbot collects data once per day** (or per configured cadence) via guided conversations and/or patient-entered values.
- Example data recorded daily:
  - BP (systolic/diastolic)
  - HR / BPM
  - adherence confirmations (meds, exercise)
  - symptom self-reports
  - engagement/responsiveness signals

### 2.3 High-level product goals
- Close the “between-appointments” visibility gap for family caregivers and doctors.
- Provide actionable, **structured summaries** (not raw transcripts) with clear reasoning.
- Support a safe escalation path and appointment scheduling flow.

---

## 3. Objectives & Success Metrics

### 3.1 Objectives
1. Provide a **single-person dashboard** for caregivers that answers:
   - “Is Ms. Tan okay today?”
   - “Why is she at risk?”
   - “What should I do next?”
2. Provide a **panel triage dashboard** for doctors that answers:
   - “Which patients need attention now?”
   - “What is the reason and supporting evidence?”
   - “What actions should I take quickly?”
3. Ensure traceability from AI outputs to underlying structured signals.
4. Ensure privacy, access control, and auditability.

### 3.2 Suggested KPIs (for pilot/demo readiness)
- Caregiver engagement: weekly active caregivers
- Action completion: % of alerts leading to an action (message/call/appointment)
- Time to acknowledge a red alert
- % days with completed daily check-in (per patient)
- Doctor triage throughput (patients reviewed/day)
- Appointment conversion rate from “escalation recommended”
- False-positive tolerance (qualitative review)

---

## 4. Scope

### 4.1 In scope (MVP)
- Web portal with two primary views:
  - **Caregiver View (Ana):** single-patient focus
  - **Doctor View (Dr. Chan):** multi-patient panel
- Daily ingestion of chatbot-derived structured events/metrics
- Risk status banner + AI reasoning
- Key clinical metrics tiles and trend charts
- Alert timeline (structured, non-transcript)
- Appointment scheduling workflow (mock or integrated)
- Escalation workflow (doctor/family)
- Role-based access control
- Audit logs for actions

### 4.2 Out of scope (MVP)
- Real-time vitals streaming / continuous monitoring
- Direct emergency services activation (e.g., automated 995 calling)
- Medication prescribing, dose changes, or clinical orders
- Payments / billing
- Full EHR integration (beyond demo-level placeholders)

---

## 5. Users, Roles, and Permissions

### 5.1 Roles
1. **Caregiver (Family) – Ana**
   - Access limited to one or more linked patients (e.g., Ms. Tan)
   - Can view dashboards, insights, and event history
   - Can perform non-clinical actions (message, call, schedule appointment request, escalation)

2. **Doctor – Dr. Chan**
   - Access to a panel of assigned patients
   - Can triage, view details, add notes, initiate appointment scheduling, send follow-up tasks/messages

3. **Optional future roles**
   - Care coordinator / nurse operator (panel manager)
   - Programme operator / system steward (aggregate analytics)
   - Admin (user management)

### 5.2 Permission matrix (MVP)
| Capability | Caregiver | Doctor |
|---|---:|---:|
| View patient vitals trends | ✅ | ✅ |
| View adherence & engagement signals | ✅ | ✅ |
| View structured alert timeline | ✅ | ✅ |
| View AI summaries | ✅ | ✅ |
| Send message to chatbot device | ✅ | ✅ |
| Create caregiver notes | ✅ | ✅ (clinical notes) |
| View doctor notes | Read-only | ✅ |
| Schedule appointment | Request/Initiate | ✅ |
| Escalate case to doctor | ✅ | ✅ |
| View multi-patient panel | ❌ | ✅ |
| View geolocation map | ❌ | ✅ |

---

## 6. Data Model (Logical)

### 6.1 Core entities
- **Patient**
  - patient_id, name, age, conditions, address (optional), doctor_id, caregiver_ids
- **User**
  - user_id, role, name, contact methods
- **Daily Check-in Session**
  - session_id, patient_id, date, status (completed/partial/missed), created_at
- **Vitals Record (derived from daily input)**
  - patient_id, datetime, bp_sys, bp_dia, hr_bpm, source="chatbot"
- **Adherence Events**
  - meds_morning_taken, meds_evening_taken, exercise_done, hydration_done (optional), plus confidence/status
- **Symptom Signals**
  - symptom_type (e.g., dizziness), severity (mild/moderate/severe), frequency, timestamp
- **Engagement Signals**
  - check_in_response_time, completion_rate, no_response_streak
- **Alert**
  - alert_id, patient_id, severity (green/yellow/red), reason_codes, created_at, status (open/acknowledged/resolved), assigned_to
- **AI Summary**
  - summary_id, patient_id, date_range, narrative, key_drivers[], confidence, generated_at
- **Appointment**
  - appointment_id, patient_id, doctor_id, datetime, status (requested/scheduled/completed/cancelled), reason, notes
- **Action Log (Audit)**
  - action_id, actor_user_id, patient_id, action_type, payload, timestamp

### 6.2 Reason codes (examples)
- BP_UPTREND_5D
- HR_UPTREND_5D
- MISSED_MEDS_STREAK_2
- SYMPTOM_DIZZINESS_REPEAT
- NO_RESPONSE_STREAK_2
- ENGAGEMENT_DROP_30PCT

---

## 7. Risk Status & Decision Logic Requirements

### 7.1 Risk status banner
The caregiver and doctor views must display a banner with:
- **Current risk level:** Green / Yellow / Red
- **Top 1–3 drivers** (reason codes mapped to human language)
- **Last updated timestamp**
- **Data freshness indicator** (e.g., “latest check-in recorded today 09:05”)
- **Explainability panel**: “Why this status?” (must be consistent with structured evidence)

### 7.2 Risk scoring approach (MVP demo-safe)
- Implement a **transparent, rules-based scoring** (configurable weights) to:
  - Reduce “black box” concerns
  - Allow predictable demo behaviour
- Risk score components (example):
  - Missed meds streak
  - BP trend vs baseline
  - Symptom mentions (severity-weighted)
  - Non-response / engagement drop

**Requirement:** the UI must show drivers without exposing proprietary weights if not desired. A toggle may show “Detailed scoring” for clinicians only.

### 7.3 Alert creation
System creates an alert when:
- Risk transitions to Yellow/Red
- Or a specific rule triggers (e.g., “severe symptom mention”)
Alerts must include:
- severity
- reason codes
- evidence pointers (e.g., “BP readings on dates X/Y/Z”, “missed meds on date X”)

---

## 8. Portal Information Architecture & UI Requirements

The portal has two main tabs:
- **Caregiver**
- **Doctor**

### 8.1 Caregiver Page (Ana) – Single Patient Dashboard

#### 8.1.1 Header (sticky)
Must include:
- Patient identity: Ms. Tan, 68
- Conditions: hypertension; mild heart attack last week
- Primary caregiver: Ana
- Doctor contact: Dr. Chan
- Quick actions:
  - Call Ms. Tan
  - Message via chatbot
  - Escalate / book appointment
  - Emergency guidance panel (static guidance + contacts; no auto-call)

#### 8.1.2 Risk status banner (top, full width)
As per Section 7.

#### 8.1.3 “Today at a Glance” tiles (4–6)
Tiles must display (configurable):
- Medication adherence (today + 7-day streak)
- BP/HR recorded (latest + trend arrow)
- Symptoms (none/flags + severity)
- Exercise/activity (goal + completion)
- Mood/wellbeing (simple scale)
- Engagement/responsiveness (completion + response latency)

Each tile must have:
- Current state
- Last updated time
- “Learn more” explanation tooltips for non-clinical users

#### 8.1.4 Trend charts (7/14/30 days)
Must include at minimum:
- BP trend
- HR trend
- Medication adherence trend

Optional:
- Symptom frequency trend
- Engagement trend

Chart requirements:
- Toggle for 7/14/30 days
- Missing data markers
- Informational target bands (non-prescriptive)
- Ability to switch between “daily points” and “rolling average” (optional)

#### 8.1.5 AI Summary section (“Key Things to Note”)
Must include:
- Daily highlights (3–5 bullets)
- “Why the banner is X color” explanation
- Suggested caregiver actions phrased as **supportive prompts**, not medical advice
- Confidence/freshness stamp

#### 8.1.6 Alert timeline (structured, no transcript)
Must show last 7–14 days events:
- meds taken/missed
- vitals recorded
- symptom flags
- non-response
- caregiver actions (calls/messages)
- doctor actions (notes/appointments)

Event expansion must show:
- time
- category
- short description
- source = chatbot/caregiver/doctor
- optional notes

#### 8.1.7 Escalation & Appointments panel
Two sub-panels:
1) **Appointments**
   - Next appointment
   - “Request appointment with Dr. Chan” button
   - Reason dropdown + optional notes
   - Auto-fill AI summary snippet into request

2) **Escalation**
   - Escalate to Doctor (non-urgent)
   - Escalate to backup contact (optional)
   - Log escalation actions and outcomes

#### 8.1.8 Notes & Care plan checklist
- Care plan checklist with doctor-defined items (read-only for caregiver unless enabled)
- Caregiver notes log
- Doctor notes display: **read-only** in caregiver view

---

### 8.2 Doctor Page (Dr. Chan) – Panel Triage Dashboard (Many Patients)

#### 8.2.1 Header controls
- Search bar (name/id)
- Filter chips: Red, Yellow, No data >48h, Post-discharge, Hypertension
- Sort controls: risk desc, newest alerts, upcoming appointments
- View toggles: Cards / Table / Map

#### 8.2.2 KPI counters (top row)
At minimum:
- Red alerts today
- Yellow watchlist
- No data >48h
- Appointments next 7 days

Counters must be clickable to apply filters.

#### 8.2.3 Patient cards grid (default)
Each card must display:
- Patient name + age
- Risk badge + concise AI label (e.g., “BP rising + missed meds”)
- Data freshness (e.g., updated 6h ago)
- Mini vitals snapshot (latest BP/HR)
- Adherence snapshot (7 days)
- Symptom icon(s)
- Next appointment (if any)

Card actions:
- Open patient details
- Request follow-up (message/task)
- Schedule appointment
- Add note
- Mark reviewed (optional)

#### 8.2.4 Watchlist queue (table view)
Columns:
- Patient
- Risk
- Reason
- Last update
- Next appointment
- Actions

Supports bulk actions:
- Message selected
- Schedule follow-ups
- Assign (if nurse role exists)
- Mark reviewed

#### 8.2.5 Map view (geographical)
- Pin patients by location
- Pin color indicates risk
- Hover shows mini summary
- Click opens patient detail panel
- Filters apply to map

#### 8.2.6 Patient drill-down panel (doctor)
When opening a patient:
- Risk banner + explainability
- Vitals charts
- Alert timeline
- AI summary (clinical-friendly)
- Doctor notes editor
- Appointment scheduling
- Caregiver contact info (Ana)

---

## 9. Messaging & Communication Requirements

### 9.1 Message to chatbot device (voice prompt)
- Caregiver and doctor can send a message that the chatbot will speak or present.
- Message types:
  - Free text (short)
  - Template messages (e.g., “Please remember to take your evening meds.”)
- Must log:
  - sender
  - time
  - message content
  - delivery status (queued/sent/failed)

### 9.2 Call actions (portal shortcuts)
- Caregiver can “Call Ms. Tan” (tel: link)
- Doctor can “Call caregiver” or clinic call workflow (optional)
- Must log action click (audit) even if actual call happens on device

---

## 10. Appointment Scheduling Requirements

### 10.1 Caregiver flow (request/initiate)
- Caregiver can request appointment with Dr. Chan:
  - select preferred time windows (mocked)
  - choose reason category
  - add notes
  - optionally include AI-generated summary snippet
- Status transitions:
  - Requested → Scheduled (by clinic/doctor) → Completed/Cancelled

### 10.2 Doctor flow (schedule/confirm)
- Doctor can create/schedule appointment for patient
- Can attach a pre-visit summary and instructions (non-medical or clinic logistics)
- Must appear in:
  - doctor upcoming appointments panel
  - patient detail view
  - caregiver view

---

## 11. Escalation Requirements

### 11.1 Escalation types (MVP)
- Escalate to Doctor (non-urgent)
- Escalate to caregiver backup contact (optional)
- Emergency guidance: show instructions + contacts (no automatic emergency call)

### 11.2 Escalation triggers (system suggestions)
System should suggest escalation when:
- Red alert created
- Yellow alert persists > N days
- severe symptom flag present (rules-based)

### 11.3 Escalation log
Every escalation must record:
- who initiated
- when
- reason codes
- outcome (acknowledged/resolved/pending)

---

## 12. AI Summaries & Explainability Requirements

### 12.1 Summary types
- **Daily summary** (caregiver-friendly)
- **Clinical summary** (doctor-friendly)
- **Pre-visit summary** (appointment context)

### 12.2 Constraints
- Summaries must be derived from **structured data**, not verbatim transcript.
- Summaries must provide **evidence pointers**:
  - “BP increased from X to Y over last 5 days”
  - “Missed evening meds on Feb 23”
- Summaries must include:
  - timestamp of generation
  - data coverage range (e.g., last 7 days)
  - confidence indicator (simple: low/medium/high)

### 12.3 Tone & safety
- Avoid medical diagnosis language and prescribing.
- Prefer: “may indicate”, “recommend discussing with doctor”, “consider checking in”.

---

## 13. Data Ingestion & Processing Requirements

### 13.1 Ingestion cadence
- Minimum: once daily per patient (configurable)
- Inputs:
  - Patient-entered readings via chatbot prompts
  - Yes/no adherence confirmations
  - Symptom self-reports (classified)
  - Engagement metrics (computed)

### 13.2 Processing pipeline (logical)
1) Receive daily session payload
2) Validate schema and ranges (basic)
3) Store raw session record (internal)
4) Derive structured metrics/events
5) Compute trends and risk
6) Generate alerts and summaries
7) Update portal views

### 13.3 Data validation
- Detect obviously invalid readings (e.g., BP 20/10)
- Mark as “outlier/unverified” rather than silently discarding
- Show “unverified” badge (doctor only, optional)

---

## 14. Security, Privacy, and Compliance (Baseline)

### 14.1 Authentication
- Email/password or SSO (future)
- Session management with secure cookies
- MFA optional (recommended for doctor role)

### 14.2 Authorization
- Role-based access control
- Patient-to-caregiver binding required
- Doctors restricted to assigned panel

### 14.3 Audit logging
Log:
- login events
- patient record views (doctor role at least)
- messages sent
- notes created/edited
- appointment scheduling actions
- escalation actions

### 14.4 Data protection
- Encrypt in transit (TLS)
- Encrypt at rest
- Principle of least privilege

### 14.5 Data retention (placeholder)
- Demo: configurable
- Real deployment: define retention policy with stakeholders

---

## 15. Non-Functional Requirements

### 15.1 Performance
- Caregiver dashboard load: < 3 seconds on broadband
- Doctor panel load (100+ patients): < 5 seconds with pagination

### 15.2 Availability
- Demo: best-effort
- Target for production: 99.5% monthly (placeholder)

### 15.3 Scalability
- Must support:
  - 1 caregiver viewing 1–3 patients
  - 1 doctor viewing 50–500 patients (configurable)

### 15.4 Accessibility
- WCAG-inspired baseline:
  - adequate contrast
  - large click targets
  - keyboard navigation
  - readable chart labels

### 15.5 Internationalization
- English first
- Future: Chinese (Mandarin) support for labels/messages

---

## 16. Reporting & Export (Optional / Phase 2)

- Export a PDF “Weekly summary” for caregiver
- Export clinical summary for doctor visit
- Download vitals CSV (doctor role)

---

## 17. System Observability & Ops

- Monitoring dashboards:
  - ingestion failures
  - summary generation failures
  - alert volumes
- Error reporting in UI:
  - “Data not available today”
  - “Last update failed; retry scheduled”

---

## 18. Mock Data & Demo Behaviour Requirements

### 18.1 Mock data goals
- Simulate “progressing worse” trends for vitals
- Create believable adherence misses and symptoms
- Produce occasional red/yellow flags to demonstrate escalation and scheduling

### 18.2 Demo scenarios (minimum)
1) Yellow risk due to rising BP + missed meds yesterday
2) Red risk due to severe symptom flag + no response
3) Doctor panel: 10 patients, 2 red, 3 yellow, 1 no data
4) Appointment request created by Ana, confirmed by Dr. Chan

---

## 19. Acceptance Criteria (MVP)

### 19.1 Caregiver view
- Ana can log in and see Ms. Tan dashboard with:
  - risk banner + reasons
  - tiles + trend charts
  - AI summary section
  - alert timeline
  - appointment request flow
  - escalation flow
- No transcripts displayed; only structured summaries/events.

### 19.2 Doctor view
- Dr. Chan can log in and see:
  - panel dashboard with filters/sorts
  - patient cards with risk and key signals
  - appointment list
  - map view (if location present)
  - drill-down into Ms. Tan and others

### 19.3 Data + traceability
- For every alert and summary, the system can show:
  - reason codes
  - supporting evidence points (dates/readings/events)
- All user actions are logged.

---

## 20. Open Questions (to finalize before build)

1) How many patients can a caregiver manage (1 vs multiple)?
2) Are caregiver backups required?
3) Do we need clinic staff role separate from doctor?
4) What is the exact appointment scheduling integration target (Google Calendar? clinic system? mock only)?
5) How should address/geolocation be represented (exact vs approximate for privacy)?
6) What symptom taxonomy is required for cardiac risk?
7) Do we show “normal ranges” on charts (and for which role)?
8) Do we need notifications (email/SMS/push) for red alerts?

---

## 21. Appendix: Suggested UI Copy (examples)

- Risk banner: “Needs attention today”
- Explainability: “Based on the last 5 days, BP is trending up and an evening medication was missed yesterday.”
- Action prompt: “Consider checking in with Ms. Tan and scheduling a clinic visit if symptoms continue.”
