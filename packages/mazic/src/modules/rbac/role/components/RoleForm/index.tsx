import { FormsCommon } from '@mazic/components/Commons/FormsCommon'
import { FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'

import { DetailForm } from './DetailForm'

export const RoleForm = (props: IFormProps) => {
  const formSections = [
    {
      title: 'Role Details',
      elementRender: () => <DetailForm />,
      fields: ['name', 'description'],
    },
    {
      title: 'Role Status',
      elementRender: () => <FormsCommon.CheckboxStatus />,
    },
  ]

  return (
    <FormControl
      formTitle="Role"
      formSections={formSections}
      schema={props.schema}
      initialValues={props.initialValues}
      onSubmitForm={props.onSubmitForm}
      isPendingSubmit={props.isPendingSubmit}
    />
  )
}
