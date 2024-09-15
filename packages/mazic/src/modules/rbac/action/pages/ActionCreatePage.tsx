import { getDefaultsBySchema } from '@mazic/utils/form'

import { ActionForm } from '../components/ActionForm'
import { useActionApis } from '../hooks/useActionApis'
import { actionSchema } from '../schemas/actionSchema'

const ActionCreatePage = () => {
  const mutation = useActionApis.create()

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
