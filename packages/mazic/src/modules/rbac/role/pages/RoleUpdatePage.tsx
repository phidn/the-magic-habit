import { usePageDetails } from '@mazic/hooks'

import { RoleForm } from '../components/RoleForm'
import { useRoleApis } from '../hooks/useRoleApis'
import { roleSchema } from '../schemas/roleSchema'

const RoleUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = useRoleApis.detail(pageDetails.id)
  const mutation = useRoleApis.update(pageDetails.id)

  return (
    <RoleForm
      initialValues={data}
      schema={roleSchema}
      onSubmitForm={mutation.mutateAsync}
      isPendingSubmit={mutation.isPending}
    />
  )
}

export default RoleUpdatePage
