import { getDefaultsBySchema } from '@mazic/utils/form'

import { ResourceForm } from '../components/ResourceForm'
import { useResourceApis } from '../hooks/useResourceApis'
import { resourceSchema } from '../schemas/resourceSchema'

const ResourceCreatePage = () => {
  const mutation = useResourceApis.create()
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
