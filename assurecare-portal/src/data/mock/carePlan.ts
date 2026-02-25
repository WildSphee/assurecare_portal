import type { CarePlanItem } from '@/types'

export const MOCK_CARE_PLAN: CarePlanItem[] = [
  {
    id: 'cp-001',
    patientId: 'patient-001',
    description: 'Take blood pressure medication twice daily (morning and evening)',
    frequency: 'Twice daily',
    addedBy: 'user-dr-chan',
    isCompleted: false,
  },
  {
    id: 'cp-002',
    patientId: 'patient-001',
    description: 'Monitor and record blood pressure daily via home chatbot check-in',
    frequency: 'Daily',
    addedBy: 'user-dr-chan',
    isCompleted: true,
  },
  {
    id: 'cp-003',
    patientId: 'patient-001',
    description: '30-minute light walk at least 5 days per week',
    frequency: '5× per week',
    addedBy: 'user-dr-chan',
    isCompleted: false,
  },
  {
    id: 'cp-004',
    patientId: 'patient-001',
    description: 'Contact clinic or caregiver if BP exceeds 150/90 mmHg or symptoms worsen',
    frequency: 'As needed',
    addedBy: 'user-dr-chan',
    isCompleted: false,
  },
]
