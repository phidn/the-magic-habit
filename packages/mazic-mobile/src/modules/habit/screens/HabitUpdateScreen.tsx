import { RouteProp } from '@react-navigation/native'

import { habitSchema } from '@mazic/shared'

import { RootStackNavigator } from '@/types/navigation'

import { useHabitDetail, useUpdateHabit } from '../apis'
import { HabitForm } from '../components/HabitForm'

interface IProps {
  route: RouteProp<RootStackNavigator, 'HabitUpdateScreen'>
}

export const HabitUpdateScreen = ({ route }: IProps) => {
  const habitId = route.params.habit.id
  const { data } = useHabitDetail(habitId)
  const mutation = useUpdateHabit(habitId)

  return (
    <HabitForm
      title="Update Habit"
      initialValues={data}
      schema={habitSchema}
      onSubmitForm={mutation.mutateAsync}
    />
  )
}
