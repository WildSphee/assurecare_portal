# AssureCare Portal

AssureCare Portal is a React + TypeScript + Vite demo app for caregiver/doctor workflows with mock patient data, alerts, vitals, adherence, summaries, and chat.

## Current Chat Behavior (Mocked)

The caregiver assistant chat is fully mocked.

- No OpenAI SDK/library is used.
- No OpenAI API request is made.
- Whatever the user types, the chat replies with **Mrs Tan's current status** and a concise **"What to do now"** action checklist using local mock data.
- A mock loading state is shown before each reply (3-second delay, "Reloading...").

## Recent UX / Data Updates

- Doctor patient drilldown now opens as a **centered floating window** (instead of a full-height side panel).
- Caregiver **Escalation & Appointments** opens as a centered dialog window.
- Trend charts are **daily-only** (the `3-day avg` toggle was removed).
- Chatbot avatar uses the project `bot.png` image (photo-style crop in caregiver panel and doctor floating chatbot button).
- Chatbot closes when clicking/tapping outside the chat window.
- Caregiver appointment request form opens **AI-prefilled by default** (reason, time window, notes) and no longer shows the `Include AI summary` toggle.
- Doctor patient popup header was simplified (single close button, no `Score detail` toggle, no top-right location chip).
- Doctor patient popup primary action is now **Call the Patient through AssureBot**.
- Mrs Tan's red alert now explicitly includes **mild heartache**, **missed meds**, and **caregiver escalation** signals.

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand
- Tailwind CSS
- Radix UI

## Getting Started

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Scripts

- `npm run dev` - Start local development server
- `npm run build` - Type-check and build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Environment Variables

No OpenAI environment variables are required for chat.

If your local `.env` still contains `VITE_OPENAI_API_KEY` / `VITE_OPENAI_MODEL`, they are currently unused.

## Notes

- The app uses mock data sources under `src/data/mock/`.
- The mocked chat response pulls Mrs Tan data (`patient-001`) regardless of the currently selected patient.
- Mrs Tan's active red alert includes `SYMPTOM_HEARTACHE_MILD`, `MISSED_MEDS_STREAK_2`, and `ESCALATION_FROM_CAREGIVER`.
- Dialog modals include accessibility descriptions to satisfy Radix `DialogContent` requirements.
