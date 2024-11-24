import { getDefaultsBySchema } from '@mazic/shared'

import { ResourceForm } from '../components/ResourceForm'
import { useCreateResource } from '../hooks/useResourceApis'
import { resourceSchema } from '../schemas/resourceSchema'

const ResourceCreatePage = () => {
  const mutation = useCreateResource()
  return (
    <ResourceForm
      initialValues={getDefaultsBySchema(resourceSchema)}
      schema={resourceSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default ResourceCreatePage
