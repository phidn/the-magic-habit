import { getDefaultsBySchema, roleSchema } from '@mazic/shared'

import { RoleForm } from '../components/RoleForm'
import { useCreateRole } from '../hooks/useRoleApis'

const RoleCreatePage = () => {
  const mutation = useCreateRole()

  return (
    <RoleForm
      initialValues={getDefaultsBySchema(roleSchema)}
      schema={roleSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default RoleCreatePage
