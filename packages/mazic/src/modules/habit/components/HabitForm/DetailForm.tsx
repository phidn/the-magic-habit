import { FormItem } from '@mazic/components/FormControl'
import { FormColorPicker } from '@mazic/components/FormControl/FormColorPicker'
import { FormInput } from '@mazic/components/FormControl/FormInput'

export const DetailForm = () => (
  <div className="mazic-row">
    <FormItem label="Title" required>
      <FormInput field="title" placeholder="Enter habit title..." />
    </FormItem>
    <FormItem label="Metric" required>
      <FormInput field="metric" placeholder="Enter habit metric..." />
    </FormItem>
    <FormItem label="Color" required>
      <FormColorPicker field="color" />
    </FormItem>
  </div>
)
