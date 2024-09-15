import { usePageDetails } from '@mazic/hooks'

import { PermissionForm } from '../components/PermissionForm'
import { usePermissionApis } from '../hooks/usePermissionApis'
import { permissionSchema } from '../schemas/permissionSchema'

const PermissionUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = usePermissionApis.detail(pageDetails.id)
  const mutation = usePermissionApis.update(pageDetails.id)

  return (
    <PermissionForm
      initialValues={data}
      schema={permissionSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default PermissionUpdatePage
