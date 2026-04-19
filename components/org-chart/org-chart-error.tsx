interface OrgChartErrorProps {
  error: Error
  reset: () => void
}

export function OrgChartError({ error, reset }: OrgChartErrorProps) {
  return (
    <div className="flex h-full items-center justify-center bg-[var(--bg)]">
      <div className="text-center max-w-md px-6">
        <h2 className="text-xl font-semibold text-[var(--g900)] mb-2">
          Failed to load organization chart
        </h2>
        <p className="text-sm text-[var(--g500)] mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[var(--g900)] text-[var(--bg)] rounded-md 
                     hover:bg-[var(--g700)] transition-colors active:translate-y-px"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
