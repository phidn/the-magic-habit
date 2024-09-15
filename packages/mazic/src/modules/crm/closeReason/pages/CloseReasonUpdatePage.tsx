import { usePageDetails } from '@mazic/hooks'

import { CloseReasonForm } from '../forms/CloseReasonForm'
import { useCloseReasonApis } from '../hooks/useCloseReasonApis'
import { closeReasonSchema } from '../schemas/closeReasonSchema'

const CloseReasonUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = useCloseReasonApis.detail(pageDetails.id)
  const mutation = useCloseReasonApis.update(pageDetails.id)

  return (
    <CloseReasonForm
      initialValues={data}
      schema={closeReasonSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default CloseReasonUpdatePage
