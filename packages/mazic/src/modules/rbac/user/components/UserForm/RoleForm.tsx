import { FormMultipleSelect } from '@mazic/components/FormControl'
import { useGetOptions } from '@mazic/hooks/useGetOptions'

export const RoleForm = () => {
  const { data: roleOptions = [] } = useGetOptions('ROLE')

  return (
    <div className="mazic_row">
      <FormMultipleSelect
        field="user_role_ids"
        options={roleOptions}
        placeholder="Select user roles"
      />
    </div>
  )
}
