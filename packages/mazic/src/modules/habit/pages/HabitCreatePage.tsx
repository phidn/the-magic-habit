import { getDefaultsBySchema } from '@mazic/utils/form'

import { useCreateHabit } from '../hooks/apis'
import { HabitForm } from '../components/HabitForm'
import { habitSchema } from '../validations'

const HabitCreatePage = () => {
  const mutation = useCreateHabit()
  return (
    <HabitForm
      initialValues={getDefaultsBySchema(habitSchema)}
      schema={habitSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default HabitCreatePage
