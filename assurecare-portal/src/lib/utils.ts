import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { RiskLevel } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'red': return 'text-red-600'
    case 'yellow': return 'text-amber-600'
    case 'green': return 'text-emerald-600'
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case 'red': return 'bg-red-50'
    case 'yellow': return 'bg-amber-50'
    case 'green': return 'bg-emerald-50'
  }
}

export function getRiskBorderColor(level: RiskLevel): string {
  switch (level) {
    case 'red': return 'border-red-500'
    case 'yellow': return 'border-amber-500'
    case 'green': return 'border-emerald-500'
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'red': return 'Urgent Attention'
    case 'yellow': return 'Needs Attention'
    case 'green': return 'All Clear'
  }
}

export function getRiskDotColor(level: RiskLevel): string {
  switch (level) {
    case 'red': return '#DC2626'
    case 'yellow': return '#D97706'
    case 'green': return '#16A34A'
  }
}
