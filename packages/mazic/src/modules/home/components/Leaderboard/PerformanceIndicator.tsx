interface PerformanceIndicatorProps {
  previousPosition: number
  currentPosition: number
}

export function PerformanceIndicator({
  previousPosition,
  currentPosition,
}: PerformanceIndicatorProps) {
  if (previousPosition === currentPosition) return null

  const isImproved = currentPosition < previousPosition

  return (
    <div
      className={`flex items-center gap-1 text-xs ${isImproved ? 'text-green-500' : 'text-red-500'}`}
    >
      {isImproved ? '▲' : '▼'}
      <span>{Math.abs(previousPosition - currentPosition)}</span>
    </div>
  )
}
