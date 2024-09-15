import { getDefaultsBySchema } from '@mazic/utils/form'

import { CloseReasonForm } from '../forms/CloseReasonForm'
import { useCloseReasonApis } from '../hooks/useCloseReasonApis'
import { closeReasonSchema } from '../schemas/closeReasonSchema'

const CloseReasonCreatePage = () => {
  const mutation = useCloseReasonApis.create()

  return (
    <CloseReasonForm
      initialValues={getDefaultsBySchema(closeReasonSchema)}
      schema={closeReasonSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default CloseReasonCreatePage
