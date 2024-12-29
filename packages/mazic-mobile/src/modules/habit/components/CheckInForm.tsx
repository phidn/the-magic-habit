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
      isNoDirty={!isNumberCheckIn}
    >
      <Form.DateInput label="Date" field="date" />
      {isNumberCheckIn && (
        <Form.Number label={`Value (${capitalize(habit.metric || '')})`} field="value" />
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
