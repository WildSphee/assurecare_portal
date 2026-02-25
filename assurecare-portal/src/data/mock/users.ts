import type { User } from '@/types'

export const MOCK_USERS: User[] = [
  {
    id: 'user-ana',
    role: 'caregiver',
    name: 'Ana Tan',
    contact: {
      phone: '+65-9111-2222',
      email: 'ana.tan@family.sg',
    },
  },
  {
    id: 'user-dr-chan',
    role: 'doctor',
    name: 'Dr. Chan Wei Ming',
    contact: {
      phone: '+65-6333-4444',
      email: 'dr.chan@cityclinic.sg',
    },
  },
]
