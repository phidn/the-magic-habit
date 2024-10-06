import { useFormContext } from 'react-hook-form'

import { FormItem, FormSelect } from '@mazic/components/FormControl'
import { FormColorPicker } from '@mazic/components/FormControl/FormColorPicker'
import { FormInput } from '@mazic/components/FormControl/FormInput'
import { checkInOpts, checkInType } from '@mazic/modules/check-in'

export const DetailForm = () => {
  const methods = useFormContext()
  const metricRequired = methods.watch('check_in_type') === checkInType.NUMBER

  return (
    <div className="mazic-row">
      <FormItem label="Check-in type" required>
        <FormSelect
          field="check_in_type"
          placeholder="Select check-in type..."
          options={checkInOpts}
          afterChange={(value) => {
            if (value === 'CHECKBOX') {
              methods.clearErrors('metric')
              methods.setValue('metric', null)
            }
          }}
        />
      </FormItem>
      <FormItem label="Title" required>
        <FormInput field="title" placeholder="Enter habit title..." />
      </FormItem>
      <FormItem label="Metric" required={metricRequired}>
        <FormInput field="metric" placeholder="Enter habit metric..." disabled={!metricRequired} />
      </FormItem>
      <FormItem label="Color" required>
        <FormColorPicker field="color" />
      </FormItem>
      <FormItem label="Order" required>
        <FormInput type="number" field="order" placeholder="Enter habit order..." />
      </FormItem>
    </div>
  )
}
