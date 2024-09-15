import { FormsCommon } from '@mazic/components/Commons/FormsCommon'
import { FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'
import { extractFields } from '@mazic/utils/form'

import { DetailForm } from './DetailForm'

export const PermissionForm = (props: IFormProps) => {
  const formSections = [
    {
      title: 'Permission Details',
      elementRender: () => <DetailForm />,
      fields: extractFields(DetailForm),
    },
    {
      title: 'Permission Status',
      elementRender: () => <FormsCommon.CheckboxStatus />,
    },
  ]

  return (
    <FormControl
      formTitle="Permission"
      formSections={formSections}
      schema={props.schema}
      initialValues={props.initialValues}
      onSubmitForm={props.onSubmitForm}
      isPendingSubmit={props.isPendingSubmit}
    />
  )
}
