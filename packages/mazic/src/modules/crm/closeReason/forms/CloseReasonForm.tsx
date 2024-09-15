import { FormsCommon } from '@mazic/components/Commons/FormsCommon'
import { FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'
import { extractFields } from '@mazic/utils/form'

import { DetailForm } from './DetailForm'

export const CloseReasonForm = (props: IFormProps) => {
  const formSections = [
    {
      title: 'Close Reason Details',
      elementRender: () => <DetailForm />,
      fields: extractFields(DetailForm),
    },
    {
      title: 'Close Reason Status',
      elementRender: () => <FormsCommon.CheckboxStatus />,
    },
  ]

  return (
    <FormControl
      formTitle="Close Reason"
      formSections={formSections}
      schema={props.schema}
      initialValues={props.initialValues}
      onSubmitForm={props.onSubmitForm}
      isPendingSubmit={props.isPendingSubmit}
    />
  )
}
