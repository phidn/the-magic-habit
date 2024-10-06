import { FormCheckbox, FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'

import { checkInType } from '../../utils/utils'
import { THabit } from '../../utils/validations'

import { DetailForm } from './DetailForm'

export const HabitForm = (props: IFormProps) => {
  const validateHabitDetails = (values: THabit) => {
    if (values.check_in_type === checkInType.NUMBER) {
      return !!(values.title && values.metric)
    }
    if (values.check_in_type === checkInType.CHECKBOX) {
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
      formTitle="Habit"
      formSections={formSections}
      schema={props.schema}
      initialValues={props.initialValues}
      onSubmitForm={props.onSubmitForm}
      isPendingSubmit={props.isPendingSubmit}
    />
  )
}
