import { usePageDetails } from '@mazic/hooks/usePageDetails'

import { habitApis } from '../apis'
import { HabitForm } from '../components/HabitForm'
import { habitSchema } from '../validations'

const HabitUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = habitApis.detail(pageDetails.id)
  const mutation = habitApis.update(pageDetails.id)
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
