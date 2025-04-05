interface StatBadgeProps {
  label: string
  value: string | number
}

export function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <div className="flex flex-col items-center bg-white/5 px-2 py-1 rounded">
      <span className="text-xs text-white/60">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  )
}
