import { FormMultipleSelect } from '@mazic/components/FormControl'
import { RESOURCES, useGetOptions } from '@mazic/hooks/useGetOptions'

export const RoleForm = () => {
  const { data: roleOptions = [] } = useGetOptions(RESOURCES.ROLE)

  return (
    <div className="mazic_row">
      <FormMultipleSelect field="roles" options={roleOptions} placeholder="Select user roles" />
    </div>
  )
}
