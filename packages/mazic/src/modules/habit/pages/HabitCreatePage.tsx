import { getDefaultsBySchema, habitSchema } from '@mazic/shared'

import { HabitForm } from '../components/HabitForm'
import { useCreateHabit } from '../hooks/apis'

const HabitCreatePage = () => {
  const mutation = useCreateHabit()
  return (
    <HabitForm
      title="Create Habit"
      initialValues={getDefaultsBySchema(habitSchema)}
      schema={habitSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default HabitCreatePage
