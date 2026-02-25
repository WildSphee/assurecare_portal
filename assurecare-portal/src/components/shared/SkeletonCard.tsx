export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-slate-200 flex flex-col animate-pulse">
      <div className="p-4 flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-16 bg-slate-100 rounded" />
          </div>
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
        </div>
        <div className="h-3 w-40 bg-slate-100 rounded" />
        <div className="h-4 w-36 bg-slate-100 rounded" />
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full bg-slate-200" />
          ))}
        </div>
      </div>
      <div className="px-4 py-2 border-t border-slate-100">
        <div className="h-3 w-24 bg-slate-100 rounded" />
      </div>
      <div className="px-3 py-2 border-t border-slate-100 flex gap-2">
        <div className="h-6 w-12 bg-slate-100 rounded" />
        <div className="h-6 w-6 bg-slate-100 rounded" />
        <div className="h-6 w-6 bg-slate-100 rounded" />
      </div>
    </div>
  )
}
