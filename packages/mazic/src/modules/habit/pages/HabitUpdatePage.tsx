import { usePageDetails } from '@mazic/hooks/usePageDetails'

import { HabitForm } from '../components/HabitForm'
import { useHabitDetail, useUpdateHabit } from '../hooks/apis'
import { habitSchema } from '../utils/validations'

const HabitUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = useHabitDetail(pageDetails.id)
  const mutation = useUpdateHabit(pageDetails.id)
  return (
    <HabitForm
      initialValues={data}
      schema={habitSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default HabitUpdatePage
