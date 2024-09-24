import { FormsCommon } from '@mazic/components/Commons/FormsCommon'
import { FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'
import { IFormSection } from '@mazic/types/form'

import { detailFields } from '../../schemas/permissionSchema'

import { DetailForm } from './DetailForm'

export const PermissionForm = (props: IFormProps) => {
  const formSections: IFormSection[] = [
    {
      title: 'Permission Details',
      elementRender: () => <DetailForm />,
      fields: detailFields,
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
