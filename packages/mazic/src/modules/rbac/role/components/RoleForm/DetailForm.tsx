import { useFormContext } from 'react-hook-form'
import snakeCase from 'lodash/snakeCase'

import { FormInput, FormItem } from '@mazic/components/FormControl'

export const DetailForm = () => {
  const methods = useFormContext()
  return (
    <div className="mazic_row">
      <FormItem label="Name" required>
        <FormInput
          field="name"
          placeholder="Enter role name..."
          afterChange={(value) => methods.setValue('role_key', snakeCase(value))}
        />
      </FormItem>
      <FormItem label="Description">
        <FormInput field="description" placeholder="Enter description code..." />
      </FormItem>
    </div>
  )
}
