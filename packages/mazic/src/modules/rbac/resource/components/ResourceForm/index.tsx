import { FormsCommon } from '@mazic/components/Commons/FormsCommon'
import { FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'

import { detailFields } from '../../schemas/resourceSchema'

import { ActionForm } from './ActionForm'
import { DetailForm } from './DetailForm'

export const ResourceForm = (props: IFormProps) => {
  const formSections = [
    {
      title: 'Resource Details',
      elementRender: () => <DetailForm />,
      fields: detailFields,
    },
    {
      title: 'Resource Actions',
      elementRender: () => <ActionForm />,
    },
    {
      title: 'Resource Status',
      elementRender: () => <FormsCommon.CheckboxStatus />,
    },
  ]

  return (
    <FormControl
      formTitle="Resource"
      formSections={formSections}
      schema={props.schema}
      initialValues={props.initialValues}
      onSubmitForm={props.onSubmitForm}
      isPendingSubmit={props.isPendingSubmit}
    />
  )
}
