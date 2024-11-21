import { habitSchema } from '@mazic/shared'
import { usePageDetails } from '@mazic/hooks/usePageDetails'

import { HabitForm } from '../components/HabitForm'
import { useHabitDetail, useUpdateHabit } from '../hooks/apis'

const HabitUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = useHabitDetail(pageDetails.id)
  const mutation = useUpdateHabit(pageDetails.id)
  return (
    <HabitForm
      title="Update Habit"
      initialValues={data}
      schema={habitSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default HabitUpdatePage
