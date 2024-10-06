import { usePageDetails } from '@mazic/hooks/usePageDetails'

import { useHabitDetail, useUpdateHabit } from '../apis'
import { HabitForm } from '../components/HabitForm'
import { habitSchema } from '../validations'

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
