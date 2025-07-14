import { THabit } from '@mazic/shared'

import { HabitCheckInCard } from '../HabitCheckInCard/HabitCheckInCard'

interface Props {
  habits: THabit[]
  isLoading: boolean
  refetch: () => void
  onDelete: (id: string) => void
}

export const DailyCheckIn = (props: Props) => {
  const { habits, isLoading, refetch, onDelete } = props

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-48 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCheckInCard key={habit.id} habit={habit} refetch={refetch} onDelete={onDelete} />
      ))}
    </div>
  )
}
