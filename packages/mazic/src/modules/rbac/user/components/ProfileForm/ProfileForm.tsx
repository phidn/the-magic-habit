import { FormControl } from '@mazic/components/FormControl'
import { IFormProps } from '@mazic/types'

import { detailFields } from '../../schemas/profileSchema'

import { ProfileDetail } from './ProfileDetail'

export const ProfileForm = (props: IFormProps) => {
  const formSections = [
    {
      title: 'User Details',
      elementRender: () => <ProfileDetail />,
      fields: detailFields,
    },
  ]

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
