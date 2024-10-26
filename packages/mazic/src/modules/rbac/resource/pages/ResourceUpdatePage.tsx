import { usePageDetails } from '@mazic/hooks/usePageDetails'

import { ResourceForm } from '../components/ResourceForm'
import { useResourceDetail, useUpdateResource } from '../hooks/useResourceApis'
import { resourceSchema } from '../schemas/resourceSchema'

const ResourceUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = useResourceDetail(pageDetails.id)
  const mutation = useUpdateResource(pageDetails.id)

  return (
    <ResourceForm
      initialValues={data}
      schema={resourceSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default ResourceUpdatePage
