import { useState } from 'react'

import { checkInType, THabit } from '@mazic/shared'
import { FormCheckbox, FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'
import { IFormSection } from '@mazic/types/form'

import { CriteriaForm } from './CriteriaForm'
import { DetailForm } from './DetailForm'
import { JournalForm } from './JournalForm'

export const HabitForm = (props: IFormProps) => {
  const [type, setType] = useState<string>(props?.initialValues?.check_in_type)

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
    if (values.check_in_type === checkInType.MULTI_CRITERIA) {
      return !!values.title
    }
    return true
  }

  const validateCriteria = (values: THabit) => {
    if (!values.criterions || values.criterions.length === 0) {
      return values.check_in_type !== checkInType.MULTI_CRITERIA
    }
    return values.criterions.every((criterion) => !!criterion.name)
  }

  const getFormSections = (): IFormSection[] => {
    const sections: IFormSection[] = [
      {
        title: 'Details',
        elementRender: () => <DetailForm setType={setType} />,
        validFunc: validateHabitDetails,
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

    if (type === checkInType.MULTI_CRITERIA) {
      sections.splice(1, 0, {
        title: 'Skill Criteria',
        hideTitle: true,
        elementRender: () => <CriteriaForm />,
        validFunc: validateCriteria,
      })
    }

    return sections
  }

  return (
    <FormControl
      navigateTo="/dashboard"
      formTitle={props.title}
      schema={props.schema}
      initialValues={props.initialValues}
      onSubmitForm={props.onSubmitForm}
      isPendingSubmit={props.isPendingSubmit}
      formSections={getFormSections()}
    />
  )
}
