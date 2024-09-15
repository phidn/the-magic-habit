import { FormItem } from '@mazic/components/FormControl'
import { FormInput } from '@mazic/components/FormControl/FormInput'

export const DetailForm = () => (
  <div className="mazic_row">
    <FormItem label="Name" required>
      <FormInput field="name" placeholder="Enter resource name..." />
    </FormItem>
    <FormItem label="Code" required>
      <FormInput field="code" placeholder="Enter resource code..." />
    </FormItem>
    <FormItem label="Description">
      <FormInput field="description" placeholder="Enter resource description..." />
    </FormItem>
  </div>
)
