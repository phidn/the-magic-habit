import { useFormContext } from 'react-hook-form'

import { checkInType } from '@mazic/shared'
import { FormItem, FormSelect } from '@mazic/components/FormControl'
import { FormColorPicker } from '@mazic/components/FormControl/FormColorPicker'
import { FormInput } from '@mazic/components/FormControl/FormInput'
import { checkInOpts } from '@mazic/modules/check-in'

export const DetailForm = ({ setType }: { setType: (type: string) => void }) => {
  const methods = useFormContext()
  const metricRequired = methods.watch('check_in_type') === checkInType.INPUT_NUMBER
  const metricName = methods.watch('metric')

  return (
    <div className="mazic-row">
      <FormItem label="Check-in type" required col={6}>
        <FormSelect
          field="check_in_type"
          placeholder="Select check-in type..."
          options={checkInOpts}
          afterChange={(value) => {
            if (value === 'CHECKBOX') {
              methods.clearErrors('metric')
              methods.setValue('metric', null)
            }
            setType(value)
          }}
        />
      </FormItem>
      <FormItem label="Color" required col={6}>
        <FormColorPicker field="color" />
      </FormItem>
      <FormItem label="Title" required col={12}>
        <FormInput field="title" placeholder="Enter habit title..." />
      </FormItem>
      <FormItem label="Metric (km, hour, point,...)" required={metricRequired} col={6}>
        <FormInput
          field="metric"
          placeholder="Enter habit metric (point)"
          disabled={!metricRequired}
        />
      </FormItem>
      <FormItem label="Goal number" required={metricRequired} col={6}>
        <FormInput
          type="number"
          field="goal_number"
          placeholder={`Enter goal number (10 ${metricName || 'point'})`}
          disabled={!metricRequired}
        />
      </FormItem>
    </div>
  )
}
