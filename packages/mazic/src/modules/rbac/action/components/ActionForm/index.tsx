import { FormsCommon } from '@mazic/components/Commons/FormsCommon'
import { FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'

import { actionSchema, detailFields } from '../../schemas/actionSchema'

import { DetailForm } from './DetailForm'

export const ActionForm = (props: IFormProps) => {
  const formSections = [
    {
      title: 'Action Details',
      elementRender: () => <DetailForm />,
      fields: detailFields,
    },
    {
      title: 'Action Status',
      elementRender: () => <FormsCommon.CheckboxStatus />,
    },
  ]

  return (
    <FormControl
      formTitle="Action"
      formSections={formSections}
      schema={actionSchema}
      initialValues={props.initialValues}
      onSubmitForm={props.onSubmitForm}
      isPendingSubmit={props.isPendingSubmit}
    />
  )
}
