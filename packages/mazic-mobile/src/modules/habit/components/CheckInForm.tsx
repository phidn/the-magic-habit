import { format } from 'date-fns'
import capitalize from 'lodash/capitalize'

import { checkInType, THabit } from '@mazic/shared'

import { Form } from '@/components/FormControl'
import { themeSpacing } from '@/config/theme'
import { IFormProps } from '@/types/types'

interface ICheckInFormProps extends IFormProps {
  habit: THabit
  onDeleteForm?: () => void
}

export const CheckInForm = (props: ICheckInFormProps) => {
  const { habit } = props
  const isNumberCheckIn = habit?.check_in_type === checkInType.INPUT_NUMBER

  return (
    <Form.Container
      elevated={false}
      title={props.title}
      initialValues={props.initialValues}
      schema={props.schema}
      onSubmitForm={props.onSubmitForm}
      onDeleteForm={props.onDeleteForm}
      style={{ padding: themeSpacing.md }}
    >
      <Form.Input disabled label="Date" field="_date" value={format(new Date(), 'PPP')} />
      {isNumberCheckIn && (
        <Form.Input
          label={capitalize(habit.metric || '')}
          field="value"
          inputMode="numeric"
          keyboardType="numeric"
        />
      )}
      <Form.Input
        multiline
        numberOfLines={2}
        label="Journal"
        field="journal"
        placeholder="Enter journal..."
        style={{ height: 90 }}
      />
    </Form.Container>
  )
}
