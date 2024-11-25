import { useNavigation } from '@react-navigation/native'

import { getDefaultsBySchema, habitSchema } from '@mazic/shared'

import { screens } from '@/config/config'
import { TNavigationRoot } from '@/types/navigation'

import { useCreateHabit } from '../apis'
import { HabitForm } from '../components/HabitForm'

export const HabitCreateScreen = () => {
  const navigation = useNavigation<TNavigationRoot>()
  const mutation = useCreateHabit()

  return (
    <HabitForm
      isGoBack
      title="Create Habit"
      initialValues={getDefaultsBySchema(habitSchema)}
      schema={habitSchema}
      onSubmitForm={(values) =>
        mutation.mutateAsync(values, {
          onSuccess: () => navigation.navigate(screens.HabitListScreen),
        })
      }
    />
  )
}
