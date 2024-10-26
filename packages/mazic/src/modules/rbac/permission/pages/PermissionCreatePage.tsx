import { getDefaultsBySchema } from '@mazic/utils/form'

import { PermissionForm } from '../components/PermissionForm'
import { useCreatePermission } from '../hooks/usePermissionApis'
import { permissionSchema } from '../schemas/permissionSchema'

const PermissionCreatePage = () => {
  const mutation = useCreatePermission()

  return (
    <PermissionForm
      initialValues={getDefaultsBySchema(permissionSchema)}
      schema={permissionSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default PermissionCreatePage
