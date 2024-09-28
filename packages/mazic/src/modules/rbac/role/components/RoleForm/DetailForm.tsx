import { FormInput, FormItem } from '@mazic/components/FormControl'

export const DetailForm = () => {
  return (
    <div className="mazic-row">
      <FormItem label="Name" required>
        <FormInput field="name" placeholder="Enter role name..." />
      </FormItem>
      <FormItem label="Description">
        <FormInput field="description" placeholder="Enter description code..." />
      </FormItem>
    </div>
  )
}
