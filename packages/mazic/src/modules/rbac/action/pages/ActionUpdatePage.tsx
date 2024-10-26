import { usePageDetails } from '@mazic/hooks'

import { ActionForm } from '../components/ActionForm'
import { useActionDetail, useUpdateAction } from '../hooks/useActionApis'
import { actionSchema } from '../schemas/actionSchema'

const ActionUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = useActionDetail(pageDetails.id)
  const mutation = useUpdateAction(pageDetails.id)

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
