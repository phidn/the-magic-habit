import { usePageDetails } from '@mazic/hooks'

import { PermissionForm } from '../components/PermissionForm'
import { usePermissionDetail, useUpdatePermission } from '../hooks/usePermissionApis'
import { permissionSchema } from '../schemas/permissionSchema'

const PermissionUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = usePermissionDetail(pageDetails.id)
  const mutation = useUpdatePermission(pageDetails.id)

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
