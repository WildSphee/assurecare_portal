export function SkeletonTile() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-slate-200 p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
        </div>
        <div className="w-3.5 h-3.5 bg-slate-100 rounded" />
      </div>
      <div className="space-y-1.5">
        <div className="h-8 w-32 bg-slate-200 rounded" />
        <div className="h-3 w-20 bg-slate-100 rounded" />
      </div>
      <div className="mt-3 h-3 w-28 bg-slate-100 rounded" />
    </div>
  )
}
