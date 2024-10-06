import { FormCheckbox, FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'

import { THabit } from '../../validations'

import { DetailForm } from './DetailForm'

export const HabitForm = (props: IFormProps) => {
  const formSections = [
    {
      title: 'Habit Details',
      elementRender: () => <DetailForm />,
      validFunc: (values: THabit): boolean => {
        if (values.check_in_type === 'NUMBER') {
          return !!(values.title && values.metric)
        }
        if (values.check_in_type === 'CHECKBOX') {
          return !!values.title
        }
        return true
      },
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
