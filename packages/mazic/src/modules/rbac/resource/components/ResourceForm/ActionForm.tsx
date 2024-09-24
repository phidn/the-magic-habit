import { FormMultipleSelect } from '@mazic/components/FormControl'
import { RESOURCES, useGetOptions } from '@mazic/hooks/useGetOptions'

export const ActionForm = () => {
  const { options } = useGetOptions(RESOURCES.ACTION)

  return (
    <div className="mazic_row">
      <FormMultipleSelect
        field="actions"
        options={options}
        placeholder="Select resource actions..."
      />
    </div>
  )
}
