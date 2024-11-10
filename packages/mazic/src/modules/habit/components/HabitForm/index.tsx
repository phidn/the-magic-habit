import { FormCheckbox, FormControl } from '@mazic/components/FormControl'
import { checkInType } from '@mazic/modules/check-in'
import { IFormProps } from '@mazic/types'

import { THabit } from '../../utils/validations'

import { DetailForm } from './DetailForm'

export const HabitForm = (props: IFormProps) => {
  const validateHabitDetails = (values: THabit) => {
    if (values.check_in_type === checkInType.INPUT_NUMBER) {
      return !!(values.title && values.metric)
    }
    if (
      values.check_in_type === checkInType.DONE_NOTE ||
      values.check_in_type === checkInType.DONE
    ) {
      return !!values.title
    }
    return true
  }

  const formSections = [
    {
      title: 'Habit Details',
      elementRender: () => <DetailForm />,
      validFunc: validateHabitDetails,
    },
    {
      title: 'Habit Privacy',
      elementRender: () => <FormCheckbox field="is_private" title="Private" />,
    },
  ]

  return (
    <FormControl
      isReset
      formTitle={props.title}
      schema={props.schema}
      initialValues={props.initialValues}
      onSubmitForm={props.onSubmitForm}
      isPendingSubmit={props.isPendingSubmit}
      formSections={formSections}
    />
  )
}
