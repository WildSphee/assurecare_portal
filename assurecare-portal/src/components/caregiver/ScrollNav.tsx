import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'risk', label: 'Status' },
  { id: 'today', label: 'Today' },
  { id: 'ai-summary', label: 'AI Summary' },
  { id: 'trends', label: 'Trends' },
  { id: 'timeline', label: 'Activity' },
  { id: 'notes', label: 'Notes' },
]

export function ScrollNav() {
  const [active, setActive] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const entries: Map<string, boolean> = new Map()

    observerRef.current = new IntersectionObserver(
      (observed) => {
        observed.forEach((entry) => {
          entries.set(entry.target.id, entry.isIntersecting)
        })
        // Find the first visible section (top-most)
        const visible = NAV_ITEMS.find((item) => entries.get(item.id))
        if (visible) setActive(visible.id)
      },
      { rootMargin: '-64px 0px -60% 0px', threshold: 0 }
    )

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 140
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3"
      aria-label="Page section navigation"
    >
      {NAV_ITEMS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className="group flex items-center gap-2"
          aria-label={`Go to ${label} section`}
        >
          <span
            className={cn(
              'text-xs font-medium transition-all opacity-0 group-hover:opacity-100',
              active === id ? 'opacity-100 text-primary' : 'text-slate-500'
            )}
          >
            {label}
          </span>
          <div
            className={cn(
              'rounded-full transition-all',
              active === id
                ? 'w-2.5 h-2.5 bg-primary'
                : 'w-1.5 h-1.5 bg-slate-300 group-hover:bg-slate-400'
            )}
          />
        </button>
      ))}
    </nav>
  )
}
