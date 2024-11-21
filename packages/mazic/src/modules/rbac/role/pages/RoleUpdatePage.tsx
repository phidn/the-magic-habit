import { roleSchema } from '@mazic/shared'
import { usePageDetails } from '@mazic/hooks'

import { RoleForm } from '../components/RoleForm'
import { useRoleDetail, useUpdateRole } from '../hooks/useRoleApis'

const RoleUpdatePage = () => {
  const pageDetails = usePageDetails()
  const { data } = useRoleDetail(pageDetails.id)
  const mutation = useUpdateRole(pageDetails.id)

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
