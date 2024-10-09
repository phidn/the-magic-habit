import { getDefaultsBySchema } from '@mazic/utils/form'

import { HabitForm } from '../components/HabitForm'
import { useCreateHabit } from '../hooks/apis'
import { habitSchema } from '../utils/validations'

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
