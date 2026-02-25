import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { usePatient } from '@/hooks/usePatient'
import { usePatientStore } from '@/store/usePatientStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import { formatDateTime } from '@/lib/dateUtils'
import { Lock, Plus, Stethoscope, Heart } from 'lucide-react'
import { toast } from 'sonner'

export function NotesPanel() {
  const { patientDoctorNotes, patientCaregiverNotes } = usePatient('patient-001')
  const { addCaregiverNote } = usePatientStore()
  const { logAction } = useActionLogStore()
  const [adding, setAdding] = useState(false)
  const [noteText, setNoteText] = useState('')

  const handleAddNote = () => {
    if (!noteText.trim()) return
    const id = `cnote-${Date.now()}`
    addCaregiverNote({
      id,
      patientId: 'patient-001',
      authorId: 'user-ana',
      content: noteText.trim(),
      createdAt: new Date().toISOString(),
    })
    logAction('user-ana', 'caregiver', 'patient-001', 'note_added', { noteId: id })
    toast.success('Note saved')
    setNoteText('')
    setAdding(false)
  }

  return (
    <div className="space-y-6">
      {/* Doctor Notes — read only */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-slate-700">Doctor's Notes</h3>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Lock className="w-3 h-3" /> Read only
          </span>
        </div>
        <div className="space-y-2">
          {patientDoctorNotes.length === 0 && (
            <p className="text-xs text-slate-400">No doctor notes yet.</p>
          )}
          {patientDoctorNotes.map((note) => (
            <div key={note.id} className="bg-slate-50 rounded-lg border border-slate-200 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{note.content}</p>
              <p className="text-xs text-slate-400 mt-1.5">Dr. Chan · {formatDateTime(note.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Caregiver Notes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-700">My Notes</h3>
          </div>
          {!adding && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAdding(true)}
              className="gap-1.5 text-xs"
              aria-label="Add a new caregiver note"
            >
              <Plus className="w-3.5 h-3.5" />
              Add note
            </Button>
          )}
        </div>

        {adding && (
          <div className="mb-3 space-y-2">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your note here..."
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setNoteText('') }}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {patientCaregiverNotes.length === 0 && !adding && (
            <p className="text-xs text-slate-400">No notes yet. Add a note to log observations.</p>
          )}
          {patientCaregiverNotes.map((note) => (
            <div key={note.id} className="bg-rose-50 rounded-lg border border-rose-200 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{note.content}</p>
              <p className="text-xs text-slate-400 mt-1.5">Ana · {formatDateTime(note.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
