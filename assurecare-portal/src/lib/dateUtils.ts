import {
  format,
  formatDistanceToNow,
  subDays,
  parseISO,
  isToday as dfnsIsToday,
  differenceInDays,
  isValid,
} from 'date-fns'

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy')
  } catch {
    return iso
  }
}

export function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy HH:mm')
  } catch {
    return iso
  }
}

export function formatTime(iso: string): string {
  try {
    return format(parseISO(iso), 'HH:mm')
  } catch {
    return iso
  }
}

export function formatRelative(iso: string): string {
  try {
    const date = parseISO(iso)
    if (!isValid(date)) return iso
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return iso
  }
}

export function formatShortDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d')
  } catch {
    return iso
  }
}

export function formatDayLabel(iso: string): string {
  try {
    const date = parseISO(iso)
    if (dfnsIsToday(date)) return 'Today'
    return format(date, 'EEEE, MMM d')
  } catch {
    return iso
  }
}

export function getLast7Days(): string[] {
  return getDateRange(7)
}

export function getLast14Days(): string[] {
  return getDateRange(14)
}

export function getLast30Days(): string[] {
  return getDateRange(30)
}

export function getDateRange(days: number): string[] {
  const result: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    result.push(format(subDays(new Date('2026-02-25'), i), 'yyyy-MM-dd'))
  }
  return result
}

export function isToday(iso: string): boolean {
  try {
    return dfnsIsToday(parseISO(iso))
  } catch {
    return false
  }
}

export function daysBetween(a: string, b: string): number {
  try {
    return Math.abs(differenceInDays(parseISO(a), parseISO(b)))
  } catch {
    return 0
  }
}
