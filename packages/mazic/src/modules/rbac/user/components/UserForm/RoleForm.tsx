import { FormMultipleSelect } from '@mazic/components/FormControl'
import { RESOURCES, useGetOptions } from '@mazic/hooks/useGetOptions'

export const RoleForm = () => {
  const { options } = useGetOptions(RESOURCES.ROLE)

  return (
    <div className="mazic-row">
      <FormMultipleSelect field="roles" options={options} placeholder="Select user roles" />
    </div>
  )
}
