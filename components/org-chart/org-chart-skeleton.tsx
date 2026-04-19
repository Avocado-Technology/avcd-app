export function OrgChartSkeleton() {
  return (
    <div className="flex h-full items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-20 w-72 rounded-xl bg-gray-200 animate-pulse" />
        <div className="flex gap-6">
          <div className="h-16 w-56 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-16 w-56 rounded-xl bg-gray-200 animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="h-14 w-44 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-14 w-44 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-14 w-44 rounded-xl bg-gray-200 animate-pulse" />
        </div>
        <p className="text-sm text-[var(--g500)] font-mono mt-4">
          Loading organization chart...
        </p>
      </div>
    </div>
  )
}
