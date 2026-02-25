import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, Phone } from 'lucide-react'

interface EmergencyGuidanceDialogProps {
  open: boolean
  onClose: () => void
}

export function EmergencyGuidanceDialog({ open, onClose }: EmergencyGuidanceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Emergency Guidance
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-800 mb-3">
              If Ms. Tan is unresponsive, in severe pain, or showing signs of a medical emergency:
            </p>
            <ol className="text-sm text-red-700 space-y-2 list-decimal list-inside">
              <li>Call <strong>995</strong> (Singapore Emergency Ambulance) immediately</li>
              <li>Stay with Ms. Tan until help arrives</li>
              <li>Do not give food or water if she seems unwell</li>
              <li>Unlock the door so paramedics can enter</li>
            </ol>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">Emergency Contacts</p>
            <div className="space-y-1.5">
              <a
                href="tel:995"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">995 — Emergency Services</p>
                  <p className="text-xs text-slate-500">Singapore Ambulance &amp; Fire</p>
                </div>
              </a>
              <a
                href="tel:+6563334444"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Dr. Chan Wei Ming</p>
                  <p className="text-xs text-slate-500">+65-6333-4444 · City Clinic</p>
                </div>
              </a>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">
            This panel provides guidance only. It does not automatically call emergency services.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
