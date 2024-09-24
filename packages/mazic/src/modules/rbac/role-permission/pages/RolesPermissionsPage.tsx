import { RolePermissionForm } from '../components/RolePermissionForm'
import { useRolesPermissionsList, useUpsertRolePermission } from '../hooks/apis'

const RolesPermissionsPage = () => {
  const { data, roleData, isLoading } = useRolesPermissionsList()
  const mutation = useUpsertRolePermission()

  return (
    <RolePermissionForm
      data={data}
      roleData={roleData}
      isLoading={isLoading}
      onSubmitForm={mutation.mutateAsync}
    />
  )
}

export default RolesPermissionsPage
