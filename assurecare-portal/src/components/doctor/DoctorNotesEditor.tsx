import { useState } from 'react'
import { Pencil, Lock, Plus, Stethoscope, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { usePatient } from '@/hooks/usePatient'
import { usePatientStore } from '@/store/usePatientStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import { AISummary } from '@/components/shared/AISummary'
import { AppointmentScheduleForm } from './AppointmentScheduleForm'
import { formatDate, formatRelative } from '@/lib/dateUtils'
import { toast } from 'sonner'

export function DoctorNotesEditor({ patientId }: { patientId: string }) {
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)

  const { patient, clinicalSummary, latestAlert, patientDoctorNotes, nextAppointment } =
    usePatient(patientId)
  const { addDoctorNote } = usePatientStore()
  const { logAction } = useActionLogStore()

  if (!patient) return null

  const handleAddNote = () => {
    if (!noteText.trim()) return
    const note = {
      id: `dn-${Date.now()}`,
      patientId,
      authorId: 'user-dr-chan',
      content: noteText.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visibility: 'caregiver_read_only' as const,
    }
    addDoctorNote(note)
    logAction('user-dr-chan', 'doctor', patientId, 'note_added', { noteId: note.id })
    toast.success('Clinical note added')
    setNoteText('')
    setAddingNote(false)
  }

  return (
    <div className="space-y-6">
      {/* Clinical AI Summary */}
      {clinicalSummary ? (
        <section>
          <AISummary
            summary={clinicalSummary}
            riskLevel={latestAlert?.severity ?? 'green'}
            variant="clinical"
          />
        </section>
      ) : (
        <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-400 italic">
          No clinical AI summary available for this patient.
        </div>
      )}

      {/* Doctor's Notes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-slate-700">Clinical Notes</h4>
          </div>
          {!addingNote && (
            <button
              onClick={() => setAddingNote(true)}
              className="flex items-center gap-1.5 text-xs text-primary hover:opacity-80 font-medium transition-opacity"
              aria-label="Add clinical note"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Note
            </button>
          )}
        </div>

        {/* Add note form */}
        {addingNote && (
          <div className="mb-3 space-y-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter clinical note..."
              className="text-sm resize-none bg-white"
              rows={3}
              autoFocus
              aria-label="Clinical note text"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>
                Save Note
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setAddingNote(false)
                  setNoteText('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Existing notes */}
        {patientDoctorNotes.length > 0 ? (
          <div className="space-y-2">
            {patientDoctorNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-white rounded-lg border border-slate-200 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-slate-700 leading-relaxed flex-1">
                    {editingId === note.id ? (
                      <Textarea
                        defaultValue={note.content}
                        className="text-sm resize-none"
                        rows={2}
                      />
                    ) : (
                      note.content
                    )}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    {note.visibility === 'caregiver_read_only' ? (
                      <span title="Visible to caregiver (read-only)">
                        <Lock className="w-3 h-3 text-slate-400" />
                      </span>
                    ) : null}
                    <button
                      onClick={() => setEditingId(editingId === note.id ? null : note.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-100"
                      aria-label="Edit note"
                    >
                      <Pencil className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Dr. Chan · {formatRelative(note.createdAt)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No clinical notes yet.</p>
        )}
      </section>

      {/* Appointment section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-slate-700">Appointment</h4>
        </div>

        {nextAppointment ? (
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 mb-3">
            <p className="text-sm font-medium text-emerald-800">
              {nextAppointment.reason.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">
              {nextAppointment.scheduledAt
                ? formatDate(nextAppointment.scheduledAt)
                : 'Requested — awaiting scheduling'}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic mb-3">
            No upcoming appointment scheduled.
          </p>
        )}

        <button
          onClick={() => setShowSchedule(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          aria-label="Schedule appointment"
        >
          <Calendar className="w-4 h-4" />
          {nextAppointment ? 'Schedule Follow-up Appointment' : 'Schedule Appointment'}
        </button>
      </section>

      <AppointmentScheduleForm
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
        patientId={patientId}
        patientName={patient.name}
      />
    </div>
  )
}
