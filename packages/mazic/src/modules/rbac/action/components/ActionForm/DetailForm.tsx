import { FormInput, FormItem } from '@mazic/components/FormControl'

export const DetailForm = () => (
  <div className="mazic-row">
    <FormItem label="Name" required>
      <FormInput field="name" placeholder="Enter action name..." />
    </FormItem>
    <FormItem label="Code" required>
      <FormInput field="code" placeholder="Enter resource code..." />
    </FormItem>
    <FormItem label="Description">
      <FormInput field="description" placeholder="Enter action code..." />
    </FormItem>
  </div>
)
