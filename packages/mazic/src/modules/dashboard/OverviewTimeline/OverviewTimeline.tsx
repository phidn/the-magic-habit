import { THabit } from '@mazic/modules/habit/validations'

interface Props {
  habits: THabit[]
}

export const OverviewTimeline = ({ habits }: Props) => {
  console.log('~ habits:', habits)
  return <div>OverviewTimeline</div>
}
