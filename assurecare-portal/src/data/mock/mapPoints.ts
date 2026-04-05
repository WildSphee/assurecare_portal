export interface StaticMapPoint {
  id: string
  patientId: string
  displayName: string
  location: {
    lat: number
    lng: number
  }
}

export const STATIC_MAP_POINTS: StaticMapPoint[] = [
  { id: 'map-point-001', patientId: 'patient-001', displayName: 'Aiden Tan', location: { lat: 1.3352, lng: 103.8501 } },
  { id: 'map-point-002', patientId: 'patient-001', displayName: 'Mei Lin', location: { lat: 1.3307, lng: 103.8426 } },
  { id: 'map-point-003', patientId: 'patient-002', displayName: 'Daniel Lim', location: { lat: 1.3516, lng: 103.8664 } },
  { id: 'map-point-004', patientId: 'patient-002', displayName: 'Daniel Lim', location: { lat: 1.3586, lng: 103.8334 } },
  { id: 'map-point-005', patientId: 'patient-002', displayName: 'Sarah Lee', location: { lat: 1.371, lng: 103.8328 } },
  { id: 'map-point-006', patientId: 'patient-003', displayName: 'Raj Kumar', location: { lat: 1.3669, lng: 103.8608 } },
  { id: 'map-point-007', patientId: 'patient-003', displayName: 'Noor Aisyah', location: { lat: 1.3591, lng: 103.8473 } },
  { id: 'map-point-008', patientId: 'patient-004', displayName: 'Marcus Ong', location: { lat: 1.2998, lng: 103.8527 } },
  { id: 'map-point-008', patientId: 'patient-004', displayName: 'Grace Chua', location: { lat: 1.2909, lng: 103.8406 } },
  { id: 'map-point-009', patientId: 'patient-005', displayName: 'Jason Koh', location: { lat: 1.2841, lng: 103.8468 } },
  { id: 'map-point-010', patientId: 'patient-005', displayName: 'Siti Rahman', location: { lat: 1.2912, lng: 103.8332 } },
  { id: 'map-point-011', patientId: 'patient-006', displayName: 'Wei Ming', location: { lat: 1.3134, lng: 103.8364 } },
  { id: 'map-point-012', patientId: 'patient-006', displayName: 'Hui Xin', location: { lat: 1.3015, lng: 103.8231 } },
  { id: 'map-point-013', patientId: 'patient-007', displayName: 'Jonathan Tay', location: { lat: 1.3297, lng: 103.9109 } },
  { id: 'map-point-014', patientId: 'patient-007', displayName: 'Nurul Huda', location: { lat: 1.3182, lng: 103.8971 } },
  { id: 'map-point-015', patientId: 'patient-008', displayName: 'Benjamin Goh', location: { lat: 1.3264, lng: 103.8749 } },
  { id: 'map-point-016', patientId: 'patient-008', displayName: 'Jasmine Teo', location: { lat: 1.3151, lng: 103.8604 } },
  { id: 'map-point-016', patientId: 'patient-008', displayName: 'Mr Teo', location: { lat: 1.3171, lng: 103.8684 } },
  { id: 'map-point-017', patientId: 'patient-009', displayName: 'Aaron Ng', location: { lat: 1.3498, lng: 103.7519 } },
  { id: 'map-point-018', patientId: 'patient-009', displayName: 'Priya Nair', location: { lat: 1.3362, lng: 103.7364 } },
  { id: 'map-point-019', patientId: 'patient-010', displayName: 'Yvonne Tan', location: { lat: 1.3764, lng: 103.9556 } },
  { id: 'map-point-020', patientId: 'patient-010', displayName: 'Harish Menon', location: { lat: 1.3672, lng: 103.9408 } },
  { id: 'map-point-020', patientId: 'patient-010', displayName: 'Mrs Menon', location: { lat: 1.3652, lng: 103.9678 } },
  { id: 'map-point-020', patientId: 'patient-010', displayName: 'Mr Menon', location: { lat: 1.3623, lng: 103.9523 } },
  { id: 'map-point-020', patientId: 'patient-010', displayName: 'Mr Menon', location: { lat: 1.3923, lng: 103.8523 } },
  { id: 'map-point-020', patientId: 'patient-010', displayName: 'Mr Menon', location: { lat: 1.3115, lng: 103.8241 } },
  { id: 'map-point-020', patientId: 'patient-010', displayName: 'Mr Menon', location: { lat: 1.3065, lng: 103.7345 } },
  { id: 'map-point-021', patientId: 'patient-007', displayName: 'Amelia Wong', location: { lat: 1.4378, lng: 103.7876 } },
  { id: 'map-point-022', patientId: 'patient-008', displayName: 'Ivan Ho', location: { lat: 1.4481, lng: 103.8192 } },
  { id: 'map-point-023', patientId: 'patient-009', displayName: 'Farah Ali', location: { lat: 1.4054, lng: 103.9051 } },
  { id: 'map-point-024', patientId: 'patient-010', displayName: 'Cheryl Low', location: { lat: 1.3917, lng: 103.8944 } },
  { id: 'map-point-025', patientId: 'patient-007', displayName: 'Grace Chua', location: { lat: 1.2944, lng: 103.8061 } },
  { id: 'map-point-026', patientId: 'patient-008', displayName: 'Jonathan Tay', location: { lat: 1.2873, lng: 103.8038 } },
  { id: 'map-point-027', patientId: 'patient-009', displayName: 'Noor Aisyah', location: { lat: 1.3293, lng: 103.8024 } },
  { id: 'map-point-028', patientId: 'patient-004', displayName: 'Marcus Ong', location: { lat: 1.3705, lng: 103.8891 } },
  { id: 'map-point-029', patientId: 'patient-005', displayName: 'Jasmine Teo', location: { lat: 1.3246, lng: 103.8584 } },
  { id: 'map-point-030', patientId: 'patient-007', displayName: 'Benjamin Goh', location: { lat: 1.3368, lng: 103.8873 } },
  { id: 'map-point-031', patientId: 'patient-008', displayName: 'Amelia Wong', location: { lat: 1.3073, lng: 103.9312 } },
  { id: 'map-point-032', patientId: 'patient-009', displayName: 'Farah Ali', location: { lat: 1.3026, lng: 103.9071 } },
  { id: 'map-point-033', patientId: 'patient-010', displayName: 'Ivan Ho', location: { lat: 1.3119, lng: 103.7968 } },
  { id: 'map-point-034', patientId: 'patient-007', displayName: 'Cheryl Low', location: { lat: 1.3396, lng: 103.7041 } },
  { id: 'map-point-035', patientId: 'patient-002', displayName: 'Daniel Lim', location: { lat: 1.3507, lng: 103.8489 } },
]
