// ── Core enumerations ─────────────────────────────────────────────────────────

export type RiskLevel = 'green' | 'yellow' | 'red'

export type ReasonCode =
  | 'BP_UPTREND_5D'
  | 'HR_UPTREND_5D'
  | 'MISSED_MEDS_STREAK_2'
  | 'MISSED_MEDS_YESTERDAY'
  | 'SYMPTOM_DIZZINESS_REPEAT'
  | 'SYMPTOM_CHEST_TIGHTNESS_SEVERE'
  | 'SYMPTOM_SHORTNESS_OF_BREATH'
  | 'NO_RESPONSE_STREAK_2'
  | 'ENGAGEMENT_DROP_30PCT'

export type AppointmentReason =
  | 'routine_follow_up'
  | 'bp_concern'
  | 'medication_review'
  | 'symptom_check'
  | 'post_discharge'
  | 'other'

export type ActionType =
  | 'call_initiated'
  | 'message_sent'
  | 'appointment_requested'
  | 'appointment_scheduled'
  | 'escalation_created'
  | 'note_added'
  | 'note_edited'
  | 'patient_viewed'
  | 'mark_reviewed'
  | 'follow_up_requested'

// ── Core entities ──────────────────────────────────────────────────────────────

export interface Patient {
  id: string
  name: string
  age: number
  conditions: string[]
  doctorId: string
  caregiverIds: string[]
  location?: {
    lat: number
    lng: number
    area: string
  }
  riskStatus: RiskLevel
  lastCheckinAt: string
  noResponseStreak: number
}

export interface User {
  id: string
  role: 'caregiver' | 'doctor'
  name: string
  contact: {
    phone?: string
    email?: string
  }
}

export interface CheckinSession {
  id: string
  patientId: string
  date: string
  status: 'completed' | 'partial' | 'missed'
  createdAt: string
}

export interface VitalsRecord {
  id: string
  patientId: string
  date: string
  recordedAt: string
  bpSystolic: number
  bpDiastolic: number
  hrBpm: number
  source: 'chatbot'
  qualityFlag: 'normal' | 'unverified' | 'outlier'
}

export interface AdherenceRecord {
  id: string
  patientId: string
  date: string
  medsMorningTaken: boolean | null
  medsEveningTaken: boolean | null
  exerciseDone: boolean | null
  hydrationDone: boolean | null
  source: 'chatbot'
}

export interface SymptomSignal {
  id: string
  patientId: string
  date: string
  symptomType: string
  severity: 'mild' | 'moderate' | 'severe'
  source: 'chatbot'
}

export interface EvidencePointer {
  description: string
  dates: string[]
  metric?: string
}

export interface Alert {
  id: string
  patientId: string
  severity: RiskLevel
  reasonCodes: ReasonCode[]
  evidencePointers: EvidencePointer[]
  createdAt: string
  status: 'open' | 'acknowledged' | 'resolved'
  assignedTo?: string
}

export interface AISummary {
  id: string
  patientId: string
  date: string
  summaryType: 'daily' | 'clinical' | 'pre-visit'
  narrative: string
  highlights: string[]
  keyDrivers: ReasonCode[]
  suggestedActions: string[]
  confidence: 'low' | 'medium' | 'high'
  dataCoverageRange: {
    from: string
    to: string
  }
  generatedAt: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  status: 'requested' | 'scheduled' | 'completed' | 'cancelled'
  requestedAt: string
  scheduledAt?: string
  preferredWindows?: string[]
  reason: AppointmentReason
  notes: string
  aiSummarySnippet?: string
  initiatedBy: string
}

export interface ActionLogEntry {
  id: string
  actorUserId: string
  actorRole: 'caregiver' | 'doctor'
  patientId: string
  actionType: ActionType
  payload: Record<string, unknown>
  timestamp: string
}

export interface DoctorNote {
  id: string
  patientId: string
  authorId: string
  content: string
  createdAt: string
  updatedAt: string
  visibility: 'caregiver_read_only' | 'doctor_only'
}

export interface CaregiverNote {
  id: string
  patientId: string
  authorId: string
  content: string
  createdAt: string
}

export interface ChatbotMessage {
  id: string
  senderId: string
  senderRole: 'caregiver' | 'doctor'
  patientId: string
  content: string
  messageType: 'free_text' | 'template'
  templateId?: string
  deliveryStatus: 'queued' | 'sent' | 'failed'
  sentAt: string
}

export interface EscalationRecord {
  id: string
  patientId: string
  initiatedBy: string
  escalationType: 'to_doctor' | 'to_backup_contact'
  reasonCodes: ReasonCode[]
  outcome: 'pending' | 'acknowledged' | 'resolved'
  notes?: string
  createdAt: string
  resolvedAt?: string
}

export interface CarePlanItem {
  id: string
  patientId: string
  description: string
  frequency: string
  addedBy: string
  isCompleted?: boolean
}

// ── Chart/UI types ─────────────────────────────────────────────────────────────

export interface TrendDataPoint {
  date: string
  value: number | null
  isOutlier?: boolean
}

export interface TimelineEvent {
  id: string
  timestamp: string
  category:
    | 'vitals'
    | 'meds'
    | 'symptom'
    | 'no_response'
    | 'caregiver_action'
    | 'doctor_action'
    | 'appointment'
    | 'escalation'
    | 'checkin'
  title: string
  description: string
  source: 'chatbot' | 'caregiver' | 'doctor' | 'system'
  severity?: RiskLevel
  notes?: string
  expandable: boolean
}

export interface RiskScoreBreakdown {
  level: RiskLevel
  reasonCodes: ReasonCode[]
  score: number
  scoreBreakdown: Record<string, number>
}
