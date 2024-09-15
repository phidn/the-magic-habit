import {
  FormCheckbox,
  FormCheckboxProps,
  FormItem,
  FormSelect,
} from '@mazic/components/FormControl'
import { statusOptions } from '@mazic/config/forms'

export const FormsCommon = {
  Status: () => (
    <FormItem label="Status" required>
      <FormSelect field="status" options={statusOptions} placeholder="Select menu status..." />
    </FormItem>
  ),
  CheckboxStatus: (props: Partial<FormCheckboxProps>) => (
    <FormCheckbox field="is_active" title="Active" {...props} />
  ),
}
