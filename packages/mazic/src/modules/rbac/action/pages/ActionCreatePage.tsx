import { getDefaultsBySchema } from '@mazic/shared'

import { ActionForm } from '../components/ActionForm'
import { useCreateAction } from '../hooks/useActionApis'
import { actionSchema } from '../schemas/actionSchema'

const ActionCreatePage = () => {
  const mutation = useCreateAction()

  return (
    <ActionForm
      initialValues={getDefaultsBySchema(actionSchema)}
      schema={actionSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default ActionCreatePage
