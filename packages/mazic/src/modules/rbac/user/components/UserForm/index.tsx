import { FormsCommon } from '@mazic/components/Commons/FormsCommon'
import { FormControl } from '@mazic/components/FormControl'
import { useUploadFile } from '@mazic/hooks/useUploadFile'
import { IFormProps } from '@mazic/types'
import { extractFields } from '@mazic/utils/form'

import { TUser } from '../../schemas/userSchema'

import { DetailForm } from './DetailForm'
import { RoleForm } from './RoleForm'

export const UserForm = (props: IFormProps) => {
  const formSections = [
    {
      title: 'User Details',
      elementRender: () => <DetailForm />,
      fields: extractFields(DetailForm),
    },
    {
      title: 'User Roles',
      elementRender: () => <RoleForm />,
      fields: extractFields(RoleForm),
    },
    {
      title: 'User Status',
      elementRender: () => <FormsCommon.CheckboxStatus />,
    },
  ]

  const uploadFile = useUploadFile()

  const onSubmitForm = async (values: TUser) => {
    if (values.avatar instanceof File) {
      const response = await uploadFile.mutateAsync(values.avatar)
      if (response.data.data) {
        values.avatar = response.data.data
      }
    }
    return props.onSubmitForm(values)
  }

  return (
    <FormControl
      isHasFile
      formTitle="User"
      formSections={formSections}
      schema={props.schema}
      initialValues={props.initialValues}
      onSubmitForm={props.onSubmitForm}
      isPendingSubmit={props.isPendingSubmit}
    />
  )
}
