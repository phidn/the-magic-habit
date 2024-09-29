import { getDefaultsBySchema } from '@mazic/utils/form'

import { habitApis } from '../apis'
import { HabitForm } from '../components/HabitForm'
import { habitSchema } from '../validations'

const HabitCreatePage = () => {
  const mutation = habitApis.create()
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
