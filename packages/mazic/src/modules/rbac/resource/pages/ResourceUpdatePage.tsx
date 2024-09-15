import { usePageDetails } from '@mazic/hooks/usePageDetails'

import { ResourceForm } from '../components/ResourceForm'
import { useResourceApis } from '../hooks/useResourceApis'
import { resourceSchema } from '../schemas/resourceSchema'

const ResourceUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = useResourceApis.detail(pageDetails.id)
  const mutation = useResourceApis.update(pageDetails.id)

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
