import { checkInType, THabit } from '@mazic/shared'
import { FormCheckbox, FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'

import { CriteriaForm } from './CriteriaForm'
import { DetailForm } from './DetailForm'
import { JournalForm } from './JournalForm'

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

  const validateCriteria = (values: THabit) => {
    if (!values.criteria || values.criteria.length === 0) {
      return true
    }
    return values.criteria.every((criterion) => !!criterion.name)
  }

  const formSections = [
    {
      title: 'Details',
      elementRender: () => <DetailForm />,
      validFunc: validateHabitDetails,
    },
    {
      title: 'Skill Criteria',
      hideTitle: true,
      elementRender: () => <CriteriaForm />,
      validFunc: validateCriteria,
    },
    {
      title: 'Journal Template',
      elementRender: () => <JournalForm />,
    },
    {
      title: 'Privacy',
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
