import { getDefaultsBySchema, habitSchema } from '@mazic/shared'

import { useCreateHabit } from '../apis'
import { HabitForm } from '../components/HabitForm'

export const HabitCreateScreen = () => {
  const mutation = useCreateHabit()

  return (
    <HabitForm
      title="Create Habit"
      initialValues={getDefaultsBySchema(habitSchema)}
      schema={habitSchema}
      onSubmitForm={mutation.mutateAsync}
    />
  )
}
