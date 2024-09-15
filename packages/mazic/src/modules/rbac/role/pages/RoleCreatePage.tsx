import { getDefaultsBySchema } from '@mazic/utils/form'

import { RoleForm } from '../components/RoleForm'
import { useRoleApis } from '../hooks/useRoleApis'
import { roleSchema } from '../schemas/roleSchema'

const RoleCreatePage = () => {
  const mutation = useRoleApis.create()

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
