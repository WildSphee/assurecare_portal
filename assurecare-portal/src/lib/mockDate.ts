import { addDays, differenceInCalendarDays, format, parse, parseISO, startOfDay } from 'date-fns'

const MOCK_ANCHOR_DAY = parseISO('2026-02-25')
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const ISO_DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/
const MONTH_DAY_RANGE_RE = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2})[–-](\d{1,2})\b/g
const MONTH_DAY_RE = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2})(?![–-]\d)\b/g

function getMockDayOffset(): number {
  return differenceInCalendarDays(startOfDay(new Date()), MOCK_ANCHOR_DAY)
}

function shiftExactDateString(value: string): string | null {
  const offset = getMockDayOffset()

  if (ISO_DATETIME_RE.test(value)) {
    return addDays(parseISO(value), offset).toISOString()
  }

  if (ISO_DATE_RE.test(value)) {
    return format(addDays(parseISO(value), offset), 'yyyy-MM-dd')
  }

  return null
}

function shiftMonthDayText(value: string): string {
  const offset = getMockDayOffset()

  const withRanges = value.replace(
    MONTH_DAY_RANGE_RE,
    (_match, month, startDayRaw, endDayRaw) => {
      const start = parse(`${month} ${startDayRaw} 2026`, 'MMM d yyyy', new Date())
      const end = parse(`${month} ${endDayRaw} 2026`, 'MMM d yyyy', new Date())
      const shiftedStart = addDays(start, offset)
      const shiftedEnd = addDays(end, offset)

      const startLabel = format(shiftedStart, 'MMM d')
      const endLabel =
        format(shiftedStart, 'MMM') === format(shiftedEnd, 'MMM')
          ? format(shiftedEnd, 'd')
          : format(shiftedEnd, 'MMM d')

      return `${startLabel}–${endLabel}`
    }
  )

  return withRanges.replace(MONTH_DAY_RE, (_match, month, dayRaw) => {
    const parsed = parse(`${month} ${dayRaw} 2026`, 'MMM d yyyy', new Date())
    return format(addDays(parsed, offset), 'MMM d')
  })
}

export function shiftMockDateString(value: string): string {
  const exactShift = shiftExactDateString(value)
  if (exactShift) return exactShift
  return shiftMonthDayText(value)
}

export function shiftMockDatesDeep<T>(input: T): T {
  if (typeof input === 'string') {
    return shiftMockDateString(input) as T
  }

  if (Array.isArray(input)) {
    return input.map((item) => shiftMockDatesDeep(item)) as T
  }

  if (input && typeof input === 'object') {
    const output: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input)) {
      output[key] = shiftMockDatesDeep(value)
    }
    return output as T
  }

  return input
}

export function getTodayIsoAtUtcTime(time: `${string}:${string}:${string}`): string {
  const today = format(new Date(), 'yyyy-MM-dd')
  return new Date(`${today}T${time}Z`).toISOString()
}
