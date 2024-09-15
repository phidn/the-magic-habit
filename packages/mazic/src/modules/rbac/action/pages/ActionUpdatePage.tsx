import { usePageDetails } from '@mazic/hooks'

import { ActionForm } from '../components/ActionForm'
import { useActionApis } from '../hooks/useActionApis'
import { actionSchema } from '../schemas/actionSchema'

const ActionUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = useActionApis.detail(pageDetails.id)
  const mutation = useActionApis.update(pageDetails.id)

  return (
    <ActionForm
      initialValues={data}
      schema={actionSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default ActionUpdatePage
